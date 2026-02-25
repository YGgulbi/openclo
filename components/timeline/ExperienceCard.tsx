'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Experience } from '@/lib/types';
import { CATEGORY_COLORS, formatPeriod, calculateDuration } from '@/lib/utils';
import { Pencil, Trash2, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
    experience: Experience;
    onEdit: () => void;
}

export default function ExperienceCard({ experience: exp, onEdit }: Props) {
    const removeExperience = useAppStore((s) => s.removeExperience);
    const [expanded, setExpanded] = useState(false);
    const color = CATEGORY_COLORS[exp.category] || '#6366f1';

    return (
        <div className="glass rounded-xl overflow-hidden card-hover group cursor-pointer" style={{ borderColor: `${color}20` }}>
            {/* Color accent bar */}
            <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />

            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                                className="text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{ background: `${color}20`, color }}
                            >
                                {exp.category}
                            </span>
                            <span className="text-xs text-white/30">
                                {formatPeriod(exp.startYear, exp.startMonth, exp.endYear, exp.endMonth, exp.isOngoing)}
                            </span>
                            <span className="text-xs text-white/20">
                                ({calculateDuration(exp.startYear, exp.startMonth, exp.endYear, exp.endMonth, exp.isOngoing)})
                            </span>
                        </div>
                        <h3 className="font-semibold text-white text-sm sm:text-base truncate">{exp.title}</h3>
                    </div>

                    {/* Satisfaction Stars */}
                    <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < exp.satisfaction ? 'text-amber-400 fill-amber-400' : 'text-white/15'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Description preview */}
                <p className="text-white/40 text-xs mt-2 line-clamp-2">{exp.description}</p>

                {/* Expandable section */}
                <button
                    id={`expand-${exp.id}`}
                    onClick={() => setExpanded((e) => !e)}
                    className="flex items-center gap-1 text-xs text-white/25 hover:text-white/50 mt-2 transition-colors"
                >
                    {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {expanded ? '접기' : '자세히 보기'}
                </button>

                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2"
                    >
                        {exp.emotions?.length > 0 && (
                            <div>
                                <span className="text-xs text-white/30">감정: </span>
                                <span className="text-xs text-white/60">{exp.emotions.join(', ')}</span>
                            </div>
                        )}
                        {exp.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {exp.skills.map((skill) => (
                                    <span key={skill} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/50">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                        {exp.achievement && (
                            <div className="text-xs">
                                <span className="text-white/30">성취: </span>
                                <span className="text-white/60">{exp.achievement}</span>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        id={`edit-${exp.id}`}
                        onClick={onEdit}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                    >
                        <Pencil className="w-3 h-3" /> 편집
                    </button>
                    <button
                        id={`delete-${exp.id}`}
                        onClick={() => removeExperience(exp.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                    >
                        <Trash2 className="w-3 h-3" /> 삭제
                    </button>
                </div>
            </div>
        </div>
    );
}
