import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        login(json.user, json.accessToken);
        navigate('/');
      }
    } catch {
      // handled by error boundary
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-moonWhite px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-gradient">Momentoo</h1>
            <p className="mt-2 text-warmGray-500">记录我们的每一个瞬间</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-warmGray-700">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="请输入邮箱"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-warmGray-700">
                密码
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="请输入密码"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full">
              登录
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-warmGray-500">
            还没有账号？{' '}
            <Link to="/register" className="font-medium text-starBlue hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}