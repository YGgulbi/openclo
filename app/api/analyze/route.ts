import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Experience } from '@/lib/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
    try {
        const { profile, experiences }: { profile: any; experiences: Experience[] } =
            await req.json();

        if (!profile || !experiences?.length) {
            return NextResponse.json(
                { error: '프로필과 경험 데이터가 필요합니다.' },
                { status: 400 }
            );
        }

        const experienceText = experiences
            .map(
                (exp, i) =>
                    `[경험 ${i + 1}] ${exp.title} (${exp.category})
기간: ${exp.startYear}.${exp.startMonth} ~ ${exp.isOngoing ? '현재' : `${exp.endYear}.${exp.endMonth}`}
설명: ${exp.description}
만족도: ${exp.satisfaction}/5
감정: ${exp.emotions?.join(', ') || ''}
역량: ${exp.skills?.join(', ') || ''}
성취: ${exp.achievement || ''}`
            )
            .join('\n\n');

        const prompt = `
당신은 청년 커리어 코치입니다. 다음 사용자의 프로필과 경험을 분석하여 JSON 형태로 결과를 반환해주세요.

사용자 프로필:
- 이름: ${profile.name}
- 출생년도: ${profile.birthYear}
- 현재 상태: ${profile.status}
- 전공: ${profile.major}
- 관심 키워드: ${profile.keywords?.join(', ') || ''}

경험 목록:
${experienceText}

다음 JSON 형식으로 분석 결과를 반환해주세요. JSON 외에 다른 텍스트는 절대 포함하지 마세요:
{
  "strengths": [
    { "name": "강점명", "score": 85, "description": "강점 설명" }
  ],
  "interests": [
    { "field": "관심 분야", "evidence": ["근거1", "근거2"] }
  ],
  "problemSolvingStyle": "문제해결 스타일 설명",
  "energyDirection": "에너지 방향성 설명",
  "actionPlans": [
    {
      "id": "plan-1",
      "title": "액션 플랜 제목",
      "description": "설명",
      "duration": "1개월",
      "difficulty": "보통",
      "category": "역량개발",
      "resources": ["리소스1"],
      "completed": false
    }
  ],
  "summary": "종합 분석 요약 (3-4문장)",
  "careerSuggestions": ["직업/진로 제안1", "직업/진로 제안2", "직업/진로 제안3"],
  "relationGraph": {
    "nodes": [
      { "id": "n1", "label": "노드 레이블", "type": "skill" }
    ],
    "links": [
      { "source": "n1", "target": "n2", "strength": 0.8 }
    ]
  }
}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI 응답에서 JSON을 파싱할 수 없습니다.');
        }

        const result = JSON.parse(jsonMatch[0]);
        result.analysisDate = new Date().toISOString();

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Analysis API Error:', error);
        return NextResponse.json(
            { error: error.message || '분석 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
