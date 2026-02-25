'use client';

import {
    RadarChart, PolarGrid, PolarAngleAxis,
    Radar, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, Cell,
} from 'recharts';
import { StrengthItem } from '@/lib/types';
import { useState } from 'react';

interface Props {
    strengths: StrengthItem[];
}

const COLORS = ['#818cf8', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9'];

export default function StrengthChart({ strengths }: Props) {
    const [view, setView] = useState<'radar' | 'bar'>('radar');

    if (!strengths?.length) return null;

    const data = strengths.map((s) => ({ subject: s.name, value: s.score, fullMark: 100 }));

    return (
        <div className="glass rounded-2xl p-6 border border-white/5">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    {(['radar', 'bar'] as const).map((v) => (
                        <button
                            key={v}
                            id={`chart-view-${v}`}
                            onClick={() => setView(v)}
                            className={`text-xs px-3 py-1.5 rounded-lg transition-all ${view === v
                                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                : 'text-white/30 hover:text-white/50'
                                }`}
                        >
                            {v === 'radar' ? '레이더' : '막대'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    {view === 'radar' ? (
                        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                            />
                            <Radar
                                name="강점"
                                dataKey="value"
                                stroke="#818cf8"
                                fill="#818cf8"
                                fillOpacity={0.25}
                                strokeWidth={2}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(15,15,20,0.95)',
                                    border: '1px solid rgba(99,102,241,0.3)',
                                    borderRadius: '12px',
                                    color: '#fafafa',
                                }}
                                formatter={(value: number | undefined) => [`${value ?? 0}점`, '강점 점수']}
                            />
                        </RadarChart>
                    ) : (
                        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 60, left: 10 }}>
                            <XAxis
                                dataKey="subject"
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(15,15,20,0.95)',
                                    border: '1px solid rgba(99,102,241,0.3)',
                                    borderRadius: '12px',
                                    color: '#fafafa',
                                }}
                                formatter={(value: number | undefined) => [`${value ?? 0}점`, '강점 점수']}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Strength Details */}
            <div className="mt-6 space-y-3">
                {strengths.map((strength, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: `${COLORS[i % COLORS.length]}20`, color: COLORS[i % COLORS.length] }}
                        >
                            {strength.score}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-white">{strength.name}</span>
                                <span className="text-xs text-white/30">{strength.score}/100</span>
                            </div>
                            {/* Progress bar */}
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${strength.score}%`,
                                        background: COLORS[i % COLORS.length],
                                    }}
                                />
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed">{strength.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
