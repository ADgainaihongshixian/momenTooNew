import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';

export default function BindCouplePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const updateUser = useAuthStore((s) => s.updateUser);
  const hasCouple = !!user?.coupleId;

  const [mode, setMode] = useState<'generate' | 'input'>('generate');
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasCouple) {
      fetchCoupleInfo();
    }
  }, [hasCouple]);

  const fetchCoupleInfo = async () => {
    try {
      const res = await fetch('/api/v1/couple', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.inviteCode) {
          setGeneratedCode(data.inviteCode);
        }
      }
    } catch {
      // handled by error boundary
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/couple/invite', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await res.json();
      if (res.ok) {
        setGeneratedCode(json.inviteCode);
      } else {
        setError(json.message || '生成邀请码失败');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (inviteCode.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/couple/join', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      });
      const json = await res.json();
      if (res.ok) {
        updateUser({ coupleId: json.coupleId });
        navigate('/');
      } else {
        setError(json.message || '绑定失败');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('邀请码已复制');
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
            <span className="mb-3 block text-5xl">💕</span>
            <h1 className="font-display text-2xl font-bold text-warmGray-800">
              {hasCouple ? '情侣空间' : '绑定你的 TA'}
            </h1>
            <p className="mt-2 text-sm text-warmGray-500">
              {hasCouple ? '你们已经绑定了' : '和你的另一半一起使用 Momentoo'}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {hasCouple ? (
            <div className="space-y-4">
              {generatedCode && (
                <div className="rounded-2xl bg-creamPink/20 p-6 text-center">
                  <p className="mb-2 text-sm text-warmGray-500">当前邀请码</p>
                  <p
                    className="text-3xl font-bold tracking-widest text-starBlue cursor-pointer"
                    onClick={copyCode}
                    title="点击复制"
                  >
                    {generatedCode}
                  </p>
                  <p className="mt-3 text-xs text-warmGray-400">
                    点击邀请码可复制
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1"
                  variant="secondary"
                >
                  {loading ? '生成中...' : '刷新邀请码'}
                </Button>
              </div>
              <Button onClick={() => navigate('/')} className="w-full">
                返回首页
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex rounded-2xl bg-warmGray-50 p-1">
                <button
                  onClick={() => setMode('generate')}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                    mode === 'generate'
                      ? 'bg-white text-warmGray-800 shadow-sm'
                      : 'text-warmGray-500'
                  }`}
                >
                  生成邀请码
                </button>
                <button
                  onClick={() => setMode('input')}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                    mode === 'input'
                      ? 'bg-white text-warmGray-800 shadow-sm'
                      : 'text-warmGray-500'
                  }`}
                >
                  输入邀请码
                </button>
              </div>

              {mode === 'generate' ? (
                <div className="space-y-4">
                  {generatedCode ? (
                    <>
                      <div className="rounded-2xl bg-creamPink/20 p-6 text-center">
                        <p className="mb-2 text-sm text-warmGray-500">你的邀请码</p>
                        <p
                          className="text-3xl font-bold tracking-widest text-starBlue cursor-pointer"
                          onClick={copyCode}
                          title="点击复制"
                        >
                          {generatedCode}
                        </p>
                        <p className="mt-3 text-xs text-warmGray-400">
                          把这个码发给你的 TA
                        </p>
                      </div>
                      <Button onClick={() => navigate('/')} className="w-full" variant="secondary">
                        返回首页
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? '生成中...' : '生成邀请码'}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    className="input-field text-center text-lg tracking-widest"
                    placeholder="输入6位邀请码"
                    maxLength={6}
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  />
                  <Button
                    onClick={handleJoin}
                    disabled={inviteCode.length < 6 || loading}
                    className="w-full"
                  >
                    {loading ? '绑定中...' : '绑定'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
