'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Experience, ExperienceCategory } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/utils';
import ExperienceCard from './ExperienceCard';
import ExperienceForm from './ExperienceForm';
import {
    Plus, Sparkles, Brain, LogOut, Clock,
    TrendingUp, ChevronRight
} from 'lucide-react';

export default function TimelinePage() {
    const router = useRouter();
    const { profile, experiences, analysisResult } = useAppStore();
    const [showForm, setShowForm] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState('');
    const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);

    // Hydration guard
    const isHydrated = useAppStore((s) => s.isHydrated);
    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-surface-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        router.replace('/');
        return null;
    }

    const handleAnalyze = async () => {
        if (experiences.length < 1) return;
        setIsAnalyzing(true);
        setAnalysisError('');
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile, experiences }),
            });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.json();
            setAnalysisResult(result);
            router.push('/analysis');
        } catch (err: any) {
            setAnalysisError(err.message || '분석 중 오류가 발생했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Sort experiences by start date
    const sorted = [...experiences].sort(
        (a, b) => a.startYear * 12 + a.startMonth - (b.startYear * 12 + b.startMonth)
    );

    const categoryCount = experiences.reduce<Record<string, number>>((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-surface-950 bg-grid">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-glow-primary opacity-40" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white text-sm">오픈클로</span>
                            <span className="text-white/30 text-xs ml-2">인생 지도</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 glass rounded-full px-3 py-1.5">
                            <div className="w-2 h-2 rounded-full bg-primary-400" />
                            <span className="text-sm text-white/70">{profile.name}</span>
                        </div>
                        {analysisResult && (
                            <button
                                onClick={() => router.push('/analysis')}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 hover:bg-primary-500/30 transition-all"
                            >
                                분석 결과 보기 <ChevronRight className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 text-white/40 hover:text-white/70 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {[
                        { label: '총 경험', value: experiences.length, icon: Clock, color: 'text-primary-400' },
                        {
                            label: '평균 만족도',
                            value: experiences.length
                                ? (experiences.reduce((s, e) => s + e.satisfaction, 0) / experiences.length).toFixed(1)
                                : '-',
                            icon: TrendingUp,
                            color: 'text-emerald-400',
                        },
                        {
                            label: '카테고리',
                            value: Object.keys(categoryCount).length,
                            icon: Sparkles,
                            color: 'text-accent-400',
                        },
                        {
                            label: '역량 수',
                            value: [...new Set(experiences.flatMap((e) => e.skills || []))].length,
                            icon: Brain,
                            color: 'text-amber-400',
                        },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="glass rounded-xl p-4">
                            <Icon className={`w-4 h-4 ${color} mb-2`} />
                            <div className="text-2xl font-bold text-white">{value}</div>
                            <div className="text-xs text-white/40 mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Category Legend */}
                {Object.keys(categoryCount).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {Object.entries(categoryCount).map(([cat, count]) => (
                            <span
                                key={cat}
                                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                                style={{
                                    background: `${CATEGORY_COLORS[cat]}20`,
                                    border: `1px solid ${CATEGORY_COLORS[cat]}40`,
                                    color: CATEGORY_COLORS[cat],
                                }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: CATEGORY_COLORS[cat] }}
                                />
                                {cat} ({count})
                            </span>
                        ))}
                    </div>
                )}

                {/* Add Experience Button */}
                <motion.button
                    id="btn-add-experience"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => { setEditingExp(null); setShowForm(true); }}
                    className="w-full mb-6 py-4 border border-dashed border-white/15 rounded-2xl text-white/40 hover:border-primary-500/50 hover:text-primary-400 hover:bg-primary-500/5 transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    새 경험 추가하기
                </motion.button>

                {/* Timeline */}
                {sorted.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <Clock className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-white/50 font-medium mb-2">아직 경험이 없어요</h3>
                        <p className="text-white/25 text-sm">위 버튼을 눌러 첫 번째 경험을 추가해보세요</p>
                    </motion.div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 timeline-line" />

                        <div className="space-y-4 pl-16">
                            <AnimatePresence>
                                {sorted.map((exp, i) => (
                                    <motion.div
                                        key={exp.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        {/* Timeline dot */}
                                        <div
                                            className="absolute left-4 w-4 h-4 rounded-full border-2 border-surface-950 shadow-lg"
                                            style={{
                                                background: CATEGORY_COLORS[exp.category] || '#6366f1',
                                                boxShadow: `0 0 12px ${CATEGORY_COLORS[exp.category] || '#6366f1'}60`,
                                            }}
                                        />
                                        <ExperienceCard
                                            experience={exp}
                                            onEdit={() => { setEditingExp(exp); setShowForm(true); }}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Analyze Button */}
                {experiences.length > 0 && (
                    <div className="mt-10 text-center">
                        {analysisError && (
                            <p className="text-red-400 text-sm mb-4">{analysisError}</p>
                        )}
                        <motion.button
                            id="btn-analyze"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/30 transition-all duration-500 btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    AI가 분석 중입니다...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-5 h-5" />
                                    AI 종합 분석 시작
                                    <Sparkles className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                        <p className="text-white/30 text-xs mt-3">
                            {experiences.length}개의 경험을 바탕으로 강점과 커리어 방향성을 분석합니다
                        </p>
                    </div>
                )}
            </main>

            {/* Experience Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <ExperienceForm
                        experience={editingExp}
                        profile={profile}
                        onClose={() => setShowForm(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
