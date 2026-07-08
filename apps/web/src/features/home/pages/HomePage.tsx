import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth';

const menuItems = [
  { path: '/timeline', label: '时间线', icon: '📸', description: '记录甜蜜瞬间' },
  { path: '/diary', label: '日记', icon: '📝', description: '写下今天的心情' },
  { path: '/anniversary', label: '纪念日', icon: '💝', description: '重要的日子不会忘' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hasCouple = !!user?.coupleId;

  return (
    <div className="min-h-screen bg-moonWhite">
      <header className="sticky top-0 z-10 border-b border-warmGray-100 bg-moonWhite/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-xl font-bold text-gradient">Momentoo</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-warmGray-500">
              {user?.nickname}
            </span>
            <button
              onClick={logout}
              className="text-sm text-warmGray-400 hover:text-warmGray-600"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-warmGray-800">
            Hi, {user?.nickname} 👋
          </h2>
          <p className="mt-1 text-warmGray-500">今天想记录些什么？</p>
        </motion.div>

        {!hasCouple && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-creamPink to-mistPurple p-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">💕</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">绑定你的另一半</h3>
                <p className="mt-1 text-sm text-white/80">
                  邀请 TA 加入你们的专属空间
                </p>
              </div>
              <Link
                to="/bind-couple"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-starBlue shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                立即绑定
              </Link>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          {menuItems.map((menuItem) => (
            <motion.div key={menuItem.path} variants={item}>
              <Link
                to={menuItem.path}
                className="card group flex items-center gap-4 transition-all hover:shadow-glow"
              >
                <span className="text-3xl">{menuItem.icon}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-warmGray-800 group-hover:text-starBlue transition-colors">
                    {menuItem.label}
                  </h3>
                  <p className="text-sm text-warmGray-400">{menuItem.description}</p>
                </div>
                <svg
                  className="ml-auto h-5 w-5 text-warmGray-300 transition-transform group-hover:translate-x-1 group-hover:text-starBlue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {hasCouple && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Link
              to="/bind-couple"
              className="inline-flex items-center gap-2 text-sm text-warmGray-400 hover:text-starBlue transition-colors"
            >
              <span>⚙️</span>
              管理情侣绑定
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
