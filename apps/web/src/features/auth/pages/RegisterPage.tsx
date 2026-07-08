import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';

const registerSchema = z
  .object({
    username: z.string().min(2, '用户名至少2个字符').max(20, '用户名最多20个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(6, '密码至少6位'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: data.username,
          email: data.email,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        login(json.user, json.accessToken);
        navigate('/bind-couple');
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
            <h1 className="font-display text-3xl font-bold text-gradient">创建账号</h1>
            <p className="mt-2 text-warmGray-500">开始记录你们的甜蜜时光</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-warmGray-700">
                用户名
              </label>
              <input
                id="username"
                type="text"
                className="input-field"
                placeholder="请输入用户名"
                {...register('username')}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-warmGray-700">
                确认密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input-field"
                placeholder="请再次输入密码"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full">
              注册
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-warmGray-500">
            已有账号？{' '}
            <Link to="/login" className="font-medium text-starBlue hover:underline">
              立即登录
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}