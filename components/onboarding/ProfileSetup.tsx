'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { UserProfile, Status } from '@/lib/types';
import { Sparkles, ArrowRight, User, GraduationCap, Briefcase, Tags } from 'lucide-react';

const STATUSES: Status[] = ['학생', '취업준비생', '직장인', '프리랜서', '창업가', '기타'];

const KEYWORD_SUGGESTIONS = [
    'AI', '창업', '디자인', '데이터', '마케팅', '개발', '교육', '의료',
    '환경', '글로벌', '콘텐츠', '사회적기업', '게임', '미디어', '금융',
];

const STEPS = ['기본 정보', '현재 상태', '키워드 선택'];

export default function ProfileSetup() {
    const router = useRouter();
    const setProfile = useAppStore((s) => s.setProfile);
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<Partial<UserProfile>>({
        name: '',
        birthYear: new Date().getFullYear() - 22,
        status: '학생',
        major: '',
        keywords: [],
    });
    const [customKeyword, setCustomKeyword] = useState('');

    const toggleKeyword = (kw: string) => {
        setForm((prev) => {
            const kws = prev.keywords || [];
            return {
                ...prev,
                keywords: kws.includes(kw) ? kws.filter((k) => k !== kw) : [...kws, kw],
            };
        });
    };

    const addCustomKeyword = () => {
        if (!customKeyword.trim()) return;
        toggleKeyword(customKeyword.trim());
        setCustomKeyword('');
    };

    const handleSubmit = () => {
        if (!form.name || !form.major) return;
        setProfile(form as UserProfile);
        router.push('/timeline');
    };

    const canNext = () => {
        if (step === 0) return !!form.name && !!form.major;
        if (step === 1) return !!form.status;
        return (form.keywords?.length || 0) >= 1;
    };

    return (
        <div className="min-h-screen bg-surface-950 bg-grid overflow-hidden relative">
            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-glow-primary opacity-60" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-glow-accent opacity-40" />
                {/* Floating orbs */}
                <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-primary-500/10 blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-accent-500/10 blur-3xl animate-float-delayed" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-12"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">오픈클로</span>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 mb-10"
                >
                    {STEPS.map((label, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="flex flex-col items-center gap-1.5">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${i < step
                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/40'
                                            : i === step
                                                ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/40'
                                                : 'bg-white/5 text-white/30 border border-white/10'
                                        }`}
                                >
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span
                                    className={`text-xs font-medium hidden sm:block transition-colors ${i === step ? 'text-primary-300' : 'text-white/30'
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`w-16 h-0.5 rounded-full transition-all duration-500 ${i < step ? 'bg-primary-500' : 'bg-white/10'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg glass-strong rounded-2xl p-8 shadow-2xl shadow-black/40"
                >
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">안녕하세요! 👋</h1>
                                    <p className="text-white/50 text-sm">당신에 대해 알려주세요</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            <User className="inline w-4 h-4 mr-1.5 text-primary-400" />
                                            이름
                                        </label>
                                        <input
                                            id="input-name"
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                            placeholder="홍길동"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            출생년도
                                        </label>
                                        <input
                                            id="input-birth-year"
                                            type="number"
                                            value={form.birthYear}
                                            onChange={(e) =>
                                                setForm((p) => ({ ...p, birthYear: Number(e.target.value) }))
                                            }
                                            min={1960}
                                            max={new Date().getFullYear()}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            <GraduationCap className="inline w-4 h-4 mr-1.5 text-primary-400" />
                                            전공 / 전문 분야
                                        </label>
                                        <input
                                            id="input-major"
                                            type="text"
                                            value={form.major}
                                            onChange={(e) => setForm((p) => ({ ...p, major: e.target.value }))}
                                            placeholder="컴퓨터공학, 경영학 등"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">현재 어떤 상태인가요?</h2>
                                    <p className="text-white/50 text-sm">가장 가까운 것을 선택해주세요</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {STATUSES.map((status) => (
                                        <button
                                            key={status}
                                            id={`status-${status}`}
                                            onClick={() => setForm((p) => ({ ...p, status }))}
                                            className={`p-4 rounded-xl border text-sm font-medium transition-all duration-200 ${form.status === status
                                                    ? 'border-primary-500 bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/20'
                                                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/8'
                                                }`}
                                        >
                                            <Briefcase className="w-4 h-4 mb-2 mx-auto opacity-60" />
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        관심 있는 분야는? <Tags className="inline w-6 h-6 text-primary-400" />
                                    </h2>
                                    <p className="text-white/50 text-sm">여러 개 선택 가능 (최소 1개)</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {KEYWORD_SUGGESTIONS.map((kw) => (
                                        <button
                                            key={kw}
                                            id={`keyword-${kw}`}
                                            onClick={() => toggleKeyword(kw)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${form.keywords?.includes(kw)
                                                    ? 'border-accent-500 bg-accent-500/20 text-accent-300'
                                                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                                                }`}
                                        >
                                            {kw}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        id="input-custom-keyword"
                                        type="text"
                                        value={customKeyword}
                                        onChange={(e) => setCustomKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addCustomKeyword()}
                                        placeholder="직접 입력..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary-500 transition-all"
                                    />
                                    <button
                                        onClick={addCustomKeyword}
                                        className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors"
                                    >
                                        추가
                                    </button>
                                </div>
                                {(form.keywords?.length || 0) > 0 && (
                                    <p className="text-xs text-primary-400">
                                        {form.keywords?.length}개 선택됨: {form.keywords?.join(', ')}
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 mt-8">
                        {step > 0 && (
                            <button
                                onClick={() => setStep((s) => s - 1)}
                                className="flex-1 py-3 border border-white/10 rounded-xl text-white/60 hover:bg-white/5 transition-all text-sm font-medium"
                            >
                                이전
                            </button>
                        )}
                        <motion.button
                            id={step === STEPS.length - 1 ? 'btn-start' : 'btn-next'}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={step === STEPS.length - 1 ? handleSubmit : () => setStep((s) => s + 1)}
                            disabled={!canNext()}
                            className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all btn-glow ${canNext()
                                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50'
                                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                                }`}
                        >
                            {step === STEPS.length - 1 ? (
                                <>
                                    인생 지도 시작하기
                                    <Sparkles className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    다음
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                <p className="mt-6 text-xs text-white/20 text-center">
                    개인 정보는 브라우저에만 저장되며 외부로 전송되지 않습니다.
                </p>
            </div>
        </div>
    );
}
