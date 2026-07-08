import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('AI_API_KEY', '');
    this.baseUrl = this.configService.get<string>('AI_BASE_URL', 'https://api.openai.com/v1');
    this.model = this.configService.get<string>('AI_MODEL', 'gpt-3.5-turbo');
  }

  async generateMomentSummary(userId: string, coupleId: string) {
    const moments = await this.prisma.moment.findMany({
      where: { coupleId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    if (moments.length === 0) {
      return { summary: '还没有记录，快去创建你们的第一条记录吧！' };
    }

    const prompt = `根据以下情侣记录，生成一段温馨的回忆总结：\n${moments.map((m) => `- ${m.title}: ${m.content || ''}`).join('\n')}`;

    return this.callAi(prompt);
  }

  async generateDiarySuggestion(userId: string) {
    const today = new Date();
    const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][today.getDay()];
    const prompt = `今天是星期${dayOfWeek}，请给出3个适合情侣一起做的日记主题建议，简短温馨。`;

    return this.callAi(prompt);
  }

  async generateAnniversaryWish(anniversaryTitle: string, daysTogether: number) {
    const prompt = `为情侣生成一段纪念日祝福语，纪念日主题：${anniversaryTitle}，在一起${daysTogether}天。要求温馨浪漫，100字以内。`;

    return this.callAi(prompt);
  }

  private async callAi(prompt: string): Promise<{ content: string }> {
    if (!this.apiKey) {
      throw new BadRequestException('AI 服务未配置，请设置 AI_API_KEY 环境变量');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是情侣助手，擅长生成温馨浪漫的内容。回复简洁有爱。',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      const content = data.choices?.[0]?.message?.content || '暂时无法生成内容';

      return { content };
    } catch (error) {
      throw new BadRequestException('AI 服务调用失败，请稍后重试');
    }
  }
}
