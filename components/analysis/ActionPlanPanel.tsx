'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { ActionPlan } from '@/lib/types';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Clock, Zap, List } from 'lucide-react';

interface Props {
    actionPlans: ActionPlan[];
}

const DIFFICULTY_CONFIG = {
    '쉬움': { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    '보통': { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    '어려움': { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

export default function ActionPlanPanel({ actionPlans }: Props) {
    const toggleActionPlan = useAppStore((s) => s.toggleActionPlan);
    const [expanded, setExpanded] = useState<string | null>(null);

    const completed = actionPlans.filter((p) => p.completed).length;
    const progress = Math.round((completed / actionPlans.length) * 100);

    return (
        <div className="space-y-4">
            {/* Progress bar */}
            <div className="glass rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">진행률</span>
                    <span className="text-sm font-bold text-primary-300">{completed}/{actionPlans.length} 완료</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden progress-bar">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    />
                </div>
            </div>

            {/* Plan Cards */}
            <div className="space-y-3">
                {actionPlans.map((plan, i) => {
                    const diffConfig = DIFFICULTY_CONFIG[plan.difficulty] || DIFFICULTY_CONFIG['보통'];
                    const isExpanded = expanded === plan.id;

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`glass rounded-xl overflow-hidden border transition-all ${plan.completed ? 'border-emerald-500/20 opacity-70' : 'border-white/5'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    {/* Checkbox */}
                                    <button
                                        id={`plan-toggle-${plan.id}`}
                                        onClick={() => toggleActionPlan(plan.id)}
                                        className="mt-0.5 shrink-0 transition-transform hover:scale-110"
                                    >
                                        {plan.completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-white/25" />
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={`font-semibold text-sm ${plan.completed ? 'line-through text-white/40' : 'text-white'}`}>
                                                {plan.title}
                                            </h3>
                                            <button
                                                id={`expand-plan-${plan.id}`}
                                                onClick={() => setExpanded(isExpanded ? null : plan.id)}
                                                className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                                            >
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${diffConfig.bg} ${diffConfig.color}`}>
                                                <Zap className="inline w-3 h-3 mr-0.5" />
                                                {plan.difficulty}
                                            </span>
                                            <span className="text-xs text-white/30 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {plan.duration}
                                            </span>
                                            <span className="text-xs text-white/30">
                                                {plan.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 border-t border-white/5 pt-4 space-y-3"
                                        >
                                            <p className="text-white/60 text-sm leading-relaxed">{plan.description}</p>
                                            {plan.resources?.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-1.5 text-xs text-white/40 mb-2">
                                                        <List className="w-3 h-3" />
                                                        참고 리소스
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {plan.resources.map((r, j) => (
                                                            <li key={j} className="text-xs text-white/50 flex items-start gap-2">
                                                                <span className="text-primary-400">→</span>
                                                                {r}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
