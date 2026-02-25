import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { UserProfile, ExperienceCategory } from '@/lib/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
    try {
        const {
            profile,
            category,
            existingTitles,
        }: {
            profile: UserProfile;
            category: ExperienceCategory;
            existingTitles: string[];
        } = await req.json();

        const prompt = `
청년 커리어 코치로서, 다음 프로필의 사용자에게 "${category}" 카테고리의 경험 제목을 5개 제안해주세요.

사용자 프로필:
- 현재 상태: ${profile.status}
- 전공: ${profile.major}
- 관심 키워드: ${profile.keywords?.join(', ') || '없음'}

이미 입력된 경험: ${existingTitles.join(', ') || '없음'}

JSON 배열 형식으로만 반환해주세요. 예시:
["경험 제목1", "경험 제목2", "경험 제목3", "경험 제목4", "경험 제목5"]
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('파싱 실패');

        const suggestions = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ suggestions });
    } catch (error: any) {
        console.error('Suggest API Error:', error);
        return NextResponse.json(
            { error: error.message || '제안 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
