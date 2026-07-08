import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DiaryPage() {
  return (
    <div className="min-h-screen bg-moonWhite">
      <header className="sticky top-0 z-10 border-b border-warmGray-100 bg-moonWhite/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <Link to="/" className="text-warmGray-400 hover:text-warmGray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-display text-lg font-bold text-warmGray-800">日记</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <span className="mb-4 text-5xl">📝</span>
          <h2 className="mb-2 text-lg font-semibold text-warmGray-700">还没有日记</h2>
          <p className="mb-6 text-sm text-warmGray-400">
            写下今天的心情，和 TA 一起分享
          </p>
          <button className="btn-primary">写第一篇日记</button>
        </motion.div>
      </main>
    </div>
  );
}