'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import StrengthChart from './StrengthChart';
import ActionPlanPanel from './ActionPlanPanel';
import RelationshipGraph from './RelationshipGraph';
import {
    Sparkles, ArrowLeft, Download, Brain,
    TrendingUp, Zap, Target, Lightbulb
} from 'lucide-react';

export default function AnalysisView() {
    const router = useRouter();
    const { analysisResult, profile, isHydrated } = useAppStore();

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-surface-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!analysisResult || !profile) {
        router.replace('/');
        return null;
    }

    const {
        strengths, interests, problemSolvingStyle, energyDirection,
        actionPlans, summary, careerSuggestions, relationGraph,
    } = analysisResult;

    const infoCards = [
        {
            icon: Brain,
            label: '문제 해결 스타일',
            value: problemSolvingStyle,
            color: 'from-primary-500/20 to-accent-500/10',
            border: 'border-primary-500/20',
            iconColor: 'text-primary-400',
        },
        {
            icon: Zap,
            label: '에너지 방향성',
            value: energyDirection,
            color: 'from-amber-500/20 to-orange-500/10',
            border: 'border-amber-500/20',
            iconColor: 'text-amber-400',
        },
    ];

    return (
        <div className="min-h-screen bg-surface-950 bg-grid">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-glow-primary opacity-30" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-glow-accent opacity-20" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            id="btn-back-timeline"
                            onClick={() => router.push('/timeline')}
                            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">인생 지도</span>
                        </button>
                        <div className="w-px h-5 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary-400" />
                            <span className="text-sm font-semibold text-white">{profile.name}님의 AI 분석</span>
                        </div>
                    </div>

                    <button
                        id="btn-download"
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:border-white/20 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">저장</span>
                    </button>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Hero Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-strong rounded-2xl p-6 sm:p-8"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                AI 종합 분석 결과
                            </h1>
                            <p className="text-white/40 text-sm">
                                {new Date(analysisResult.analysisDate).toLocaleDateString('ko-KR', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                })} 분석 완료
                            </p>
                        </div>
                    </div>
                    <p className="text-white/70 leading-relaxed text-sm sm:text-base">{summary}</p>
                </motion.div>

                {/* Career Suggestions */}
                {careerSuggestions?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                            <Target className="w-5 h-5 text-primary-400" />
                            추천 커리어 방향
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {careerSuggestions.map((suggestion, i) => (
                                <div key={i} className="glass rounded-xl p-4 border border-white/5 card-hover">
                                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
                                        <span className="text-primary-400 font-bold text-sm">{i + 1}</span>
                                    </div>
                                    <p className="text-white/80 text-sm font-medium">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {infoCards.map(({ icon: Icon, label, value, color, border, iconColor }) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`glass rounded-xl p-5 border ${border} bg-gradient-to-br ${color}`}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Icon className={`w-4 h-4 ${iconColor}`} />
                                <span className="text-xs font-medium text-white/50">{label}</span>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">{value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Strengths Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                        <TrendingUp className="w-5 h-5 text-primary-400" />
                        핵심 강점 분석
                    </h2>
                    <StrengthChart strengths={strengths} />
                </motion.div>

                {/* Interests */}
                {interests?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                            <Lightbulb className="w-5 h-5 text-amber-400" />
                            관심 분야
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {interests.map((interest, i) => (
                                <div key={i} className="glass rounded-xl p-4 border border-white/5">
                                    <h3 className="font-semibold text-primary-300 mb-2">{interest.field}</h3>
                                    <ul className="space-y-1">
                                        {interest.evidence?.map((ev, j) => (
                                            <li key={j} className="text-xs text-white/50 flex items-start gap-2">
                                                <span className="text-primary-400 mt-0.5">•</span>
                                                {ev}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Relationship Graph */}
                {relationGraph && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                            <Sparkles className="w-5 h-5 text-accent-400" />
                            경험-역량 관계도
                        </h2>
                        <RelationshipGraph data={relationGraph} />
                    </motion.div>
                )}

                {/* Action Plans */}
                {actionPlans?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                            <Target className="w-5 h-5 text-emerald-400" />
                            맞춤 액션 플랜
                        </h2>
                        <ActionPlanPanel actionPlans={actionPlans} />
                    </motion.div>
                )}

                {/* Footer */}
                <div className="text-center py-6">
                    <button
                        id="btn-restart"
                        onClick={() => router.push('/')}
                        className="text-sm text-white/30 hover:text-white/60 transition-colors"
                    >
                        처음부터 다시 시작하기
                    </button>
                </div>
            </main>
        </div>
    );
}
