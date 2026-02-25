'use client';

import Link from 'next/link';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-surface-950 bg-grid flex items-center justify-center p-4">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-glow-primary opacity-30" />
            </div>
            <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary-400" />
                </div>
                <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-3">페이지를 찾을 수 없어요</h2>
                <p className="text-white/40 text-sm mb-8">
                    요청하신 페이지가 존재하지 않거나 이동되었습니다.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        홈으로
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 text-white/60 hover:text-white rounded-xl font-medium text-sm transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        이전 페이지
                    </button>
                </div>
            </div>
        </div>
    );
}
