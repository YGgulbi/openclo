import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPeriod(
    startYear: number,
    startMonth: number,
    endYear: number | null,
    endMonth: number | null,
    isOngoing: boolean
): string {
    const start = `${startYear}.${String(startMonth).padStart(2, '0')}`;
    if (isOngoing) return `${start} ~ 현재`;
    if (endYear && endMonth) {
        return `${start} ~ ${endYear}.${String(endMonth).padStart(2, '0')}`;
    }
    return start;
}

export function calculateDuration(
    startYear: number,
    startMonth: number,
    endYear: number | null,
    endMonth: number | null,
    isOngoing: boolean
): string {
    const now = new Date();
    const end = isOngoing
        ? { year: now.getFullYear(), month: now.getMonth() + 1 }
        : { year: endYear || startYear, month: endMonth || startMonth };

    const totalMonths =
        (end.year - startYear) * 12 + (end.month - startMonth);

    if (totalMonths < 1) return '1개월 미만';
    if (totalMonths < 12) return `${totalMonths}개월`;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
}

export const CATEGORY_COLORS: Record<string, string> = {
    '학업/연구': '#6366f1',
    '인턴/직장': '#0ea5e9',
    '창업/프로젝트': '#f59e0b',
    '봉사/활동': '#10b981',
    '해외경험': '#8b5cf6',
    '취미/자기계발': '#f43f5e',
    '기타': '#6b7280',
};

export const EMOTION_OPTIONS = [
    '도전적', '열정적', '성취감', '성장', '협력', '창의',
    '인내', '리더십', '자유', '탐구', '봉사', '책임감',
    '스트레스', '아쉬움', '배움',
];

export const SKILL_SUGGESTIONS = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'SQL', 'Excel', 'Figma', '포토샵', '프레젠테이션', '글쓰기',
    '데이터 분석', '프로젝트 관리', '팀워크', '커뮤니케이션', '기획',
    '영어', '중국어', '일본어', '마케팅', '세일즈', '디자인',
];
