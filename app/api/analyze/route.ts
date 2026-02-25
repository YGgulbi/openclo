import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Experience } from '@/lib/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// 응답 캐시 방지 (항상 신선한 AI 응답)
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // ─── API 키 확인 ────────────────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: '서버 설정 오류: API 키가 없습니다.' },
        { status: 500 }
      );
    }

    // ─── 입력 파싱 & 유효성 검사 ───────────────────────────────────────
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
    }

    const { profile, experiences } = body;

    if (!profile?.name || !profile?.status) {
      return NextResponse.json({ error: '프로필 정보가 올바르지 않습니다.' }, { status: 400 });
    }
    if (!Array.isArray(experiences) || experiences.length === 0) {
      return NextResponse.json({ error: '경험이 최소 1개 이상 필요합니다.' }, { status: 400 });
    }
    if (experiences.length > 50) {
      return NextResponse.json({ error: '경험은 최대 50개까지 분석 가능합니다.' }, { status: 400 });
    }

    // ─── 프롬프트 구성 ─────────────────────────────────────────────────
    const experienceText = (experiences as Experience[])
      .map(
        (exp, i) =>
          `[경험 ${i + 1}] ${exp.title} (${exp.category})
기간: ${exp.startYear}.${String(exp.startMonth).padStart(2, '0')} ~ ${exp.isOngoing ? '현재' : `${exp.endYear}.${String(exp.endMonth ?? 1).padStart(2, '0')}`
          }
설명: ${exp.description?.slice(0, 500) || '없음'}
만족도: ${exp.satisfaction}/5
감정: ${exp.emotions?.join(', ') || '없음'}
역량: ${exp.skills?.join(', ') || '없음'}
성취: ${exp.achievement?.slice(0, 200) || '없음'}`
      )
      .join('\n\n');

    const prompt = `당신은 청년 커리어 코치입니다. 다음 사용자의 프로필과 경험을 깊이 분석하여 JSON 형태로 결과를 반환해주세요.

사용자 프로필:
- 이름: ${profile.name}
- 출생년도: ${profile.birthYear}
- 현재 상태: ${profile.status}
- 전공: ${profile.major || '미입력'}
- 관심 키워드: ${profile.keywords?.join(', ') || '없음'}

경험 목록 (총 ${experiences.length}개):
${experienceText}

다음 JSON 형식으로만 응답해주세요. JSON 외 텍스트는 절대 포함 금지:
{
  "strengths": [
    { "name": "강점명", "score": 85, "description": "이 강점이 나타난 근거와 의미" }
  ],
  "interests": [
    { "field": "관심 분야명", "evidence": ["경험에서 도출된 근거1", "근거2"] }
  ],
  "problemSolvingStyle": "문제를 접근하고 해결하는 고유한 방식 (2-3문장)",
  "energyDirection": "어떤 상황에서 에너지를 얻고 몰입하는지 (2-3문장)",
  "actionPlans": [
    {
      "id": "plan-1",
      "title": "구체적인 액션 제목",
      "description": "왜 이 것이 필요한지, 어떻게 실행할지",
      "duration": "4주",
      "difficulty": "보통",
      "category": "역량개발",
      "resources": ["실행에 도움이 될 구체적 리소스"],
      "completed": false
    }
  ],
  "summary": "이 사람의 핵심 특성과 가능성에 대한 따뜻하고 통찰력 있는 종합 요약 (3-4문장)",
  "careerSuggestions": ["구체적 직업/진로1", "진로2", "진로3"],
  "relationGraph": {
    "nodes": [
      { "id": "n1", "label": "짧은 레이블", "type": "experience" },
      { "id": "n2", "label": "역량명", "type": "skill" }
    ],
    "links": [
      { "source": "n1", "target": "n2", "strength": 0.8 }
    ]
  }
}`;

    // ─── Gemini 호출 ───────────────────────────────────────────────────
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[analyze API] JSON 파싱 실패. 원본:', text.slice(0, 500));
      throw new Error('AI 응답 파싱에 실패했습니다. 다시 시도해주세요.');
    }

    const result = JSON.parse(jsonMatch[0]);
    result.analysisDate = new Date().toISOString();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[analyze API] Error:', error?.message || error);

    // Gemini 할당량 초과
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'AI 서비스 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
