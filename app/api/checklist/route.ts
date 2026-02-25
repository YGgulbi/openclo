import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
    try {
        const { actionPlanTitle, description } = await req.json();

        const prompt = `
다음 액션 플랜에 대한 구체적인 체크리스트를 5-7개 작성해주세요.

액션 플랜: ${actionPlanTitle}
설명: ${description}

JSON 배열로만 반환해주세요:
[
  { "id": "c1", "text": "체크리스트 항목", "completed": false },
  { "id": "c2", "text": "체크리스트 항목2", "completed": false }
]
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('파싱 실패');

        const checklist = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ checklist });
    } catch (error: any) {
        console.error('Checklist API Error:', error);
        return NextResponse.json(
            { error: error.message || '체크리스트 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
