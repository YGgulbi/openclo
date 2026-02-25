'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Experience, ExperienceCategory, UserProfile } from '@/lib/types';
import { EMOTION_OPTIONS, SKILL_SUGGESTIONS } from '@/lib/utils';
import { X, Sparkles, Loader2 } from 'lucide-react';

const CATEGORIES: ExperienceCategory[] = [
    '학업/연구', '인턴/직장', '창업/프로젝트',
    '봉사/활동', '해외경험', '취미/자기계발', '기타',
];

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from(
    { length: new Date().getFullYear() - 1990 + 1 },
    (_, i) => 1990 + i
).reverse();

interface Props {
    experience: Experience | null;
    profile: UserProfile;
    onClose: () => void;
}

export default function ExperienceForm({ experience, profile, onClose }: Props) {
    const { addExperience, updateExperience, experiences } = useAppStore();
    const [form, setForm] = useState<Partial<Experience>>({
        title: '',
        startYear: new Date().getFullYear(),
        startMonth: 1,
        endYear: null,
        endMonth: null,
        isOngoing: false,
        description: '',
        category: '학업/연구',
        satisfaction: 3,
        emotions: [],
        skills: [],
        achievement: '',
    });
    const [customSkill, setCustomSkill] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        if (experience) setForm(experience);
    }, [experience]);

    const fetchSuggestions = async () => {
        setIsSuggesting(true);
        try {
            const res = await fetch('/api/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile,
                    category: form.category,
                    existingTitles: experiences.map((e) => e.title),
                }),
            });
            const data = await res.json();
            setSuggestions(data.suggestions || []);
        } catch {
            // silently fail
        } finally {
            setIsSuggesting(false);
        }
    };

    const toggleEmotion = (e: string) =>
        setForm((p) => ({
            ...p,
            emotions: p.emotions?.includes(e)
                ? p.emotions.filter((x) => x !== e)
                : [...(p.emotions || []), e],
        }));

    const toggleSkill = (s: string) =>
        setForm((p) => ({
            ...p,
            skills: p.skills?.includes(s)
                ? p.skills.filter((x) => x !== s)
                : [...(p.skills || []), s],
        }));

    const handleSubmit = () => {
        if (!form.title || !form.description) return;
        if (experience) {
            updateExperience(experience.id, form);
        } else {
            addExperience({
                ...form,
                id: `exp-${Date.now()}`,
            } as Experience);
        }
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="w-full max-w-2xl glass-strong rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">
                        {experience ? '경험 수정' : '새 경험 추가'}
                    </h2>
                    <button
                        id="btn-close-form"
                        onClick={onClose}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 space-y-5">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">카테고리</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    id={`cat-${cat}`}
                                    onClick={() => setForm((p) => ({ ...p, category: cat }))}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.category === cat
                                            ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                                            : 'border-white/10 text-white/40 hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title + AI Suggest */}
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">경험 제목</label>
                        <div className="flex gap-2">
                            <input
                                id="input-exp-title"
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                placeholder="경험 제목을 입력하세요"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary-500 transition-all"
                            />
                            <button
                                id="btn-ai-suggest"
                                onClick={fetchSuggestions}
                                disabled={isSuggesting}
                                className="flex items-center gap-1.5 px-4 py-3 bg-accent-600/20 border border-accent-500/30 text-accent-300 rounded-xl text-sm hover:bg-accent-600/30 transition-all disabled:opacity-50"
                            >
                                {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                제안
                            </button>
                        </div>
                        {suggestions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { setForm((p) => ({ ...p, title: s })); setSuggestions([]); }}
                                        className="text-xs px-3 py-1.5 glass rounded-full text-white/60 hover:text-white border border-white/10 hover:border-primary-500/50 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">시작</label>
                            <div className="flex gap-2">
                                <select
                                    value={form.startYear}
                                    onChange={(e) => setForm((p) => ({ ...p, startYear: Number(e.target.value) }))}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"
                                >
                                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <select
                                    value={form.startMonth}
                                    onChange={(e) => setForm((p) => ({ ...p, startMonth: Number(e.target.value) }))}
                                    className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"
                                >
                                    {MONTHS.map((m) => <option key={m} value={m}>{m}월</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">종료</label>
                            {form.isOngoing ? (
                                <div className="flex items-center h-10 px-4 glass rounded-xl text-primary-300 text-sm">현재 진행중</div>
                            ) : (
                                <div className="flex gap-2">
                                    <select
                                        value={form.endYear || ''}
                                        onChange={(e) => setForm((p) => ({ ...p, endYear: Number(e.target.value) }))}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="">연도</option>
                                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <select
                                        value={form.endMonth || ''}
                                        onChange={(e) => setForm((p) => ({ ...p, endMonth: Number(e.target.value) }))}
                                        className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="">월</option>
                                        {MONTHS.map((m) => <option key={m} value={m}>{m}월</option>)}
                                    </select>
                                </div>
                            )}
                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isOngoing}
                                    onChange={(e) => setForm((p) => ({ ...p, isOngoing: e.target.checked, endYear: null, endMonth: null }))}
                                    className="rounded border-white/20 bg-white/5 accent-primary-500"
                                />
                                <span className="text-xs text-white/40">현재 진행중</span>
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">경험 설명</label>
                        <textarea
                            id="input-exp-description"
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="어떤 활동을 했나요? 구체적으로 작성할수록 분석이 정확해집니다."
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary-500 resize-none"
                        />
                    </div>

                    {/* Satisfaction */}
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">만족도</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    id={`satisfaction-${n}`}
                                    onClick={() => setForm((p) => ({ ...p, satisfaction: n }))}
                                    className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${form.satisfaction === n
                                            ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                                            : 'border-white/10 text-white/30 hover:border-white/20'
                                        }`}
                                >
                                    {'⭐'.repeat(n)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Emotions */}
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">관련 감정/특성</label>
                        <div className="flex flex-wrap gap-2">
                            {EMOTION_OPTIONS.map((em) => (
                                <button
                                    key={em}
                                    onClick={() => toggleEmotion(em)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.emotions?.includes(em)
                                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                                            : 'border-white/10 text-white/40 hover:border-white/20'
                                        }`}
                                >
                                    {em}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">습득한 역량</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {SKILL_SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => toggleSkill(s)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.skills?.includes(s)
                                            ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                                            : 'border-white/10 text-white/40 hover:border-white/20'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customSkill}
                                onChange={(e) => setCustomSkill(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && customSkill.trim()) {
                                        toggleSkill(customSkill.trim());
                                        setCustomSkill('');
                                    }
                                }}
                                placeholder="직접 추가..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/20 text-xs focus:outline-none focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {/* Achievement */}
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">주요 성취 (선택)</label>
                        <input
                            type="text"
                            value={form.achievement}
                            onChange={(e) => setForm((p) => ({ ...p, achievement: e.target.value }))}
                            placeholder="대회 수상, 프로젝트 완성 등..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-white/10 rounded-xl text-white/50 hover:bg-white/5 transition-all text-sm"
                    >
                        취소
                    </button>
                    <motion.button
                        id="btn-save-experience"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleSubmit}
                        disabled={!form.title || !form.description}
                        className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-primary-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {experience ? '수정하기' : '추가하기'}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
