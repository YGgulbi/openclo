import { NextRequest, NextResponse } from 'next/server';

// ─── In-memory rate limiter (Edge 호환) ───────────────────────────────────
// Vercel Edge에서는 전역 Map이 워커별로 존재하므로 간단한 제한에 충분
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1분
const RATE_LIMIT_MAX = 10;             // 분당 10회 (API 라우트)

function getRateLimitKey(req: NextRequest): string {
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        'unknown';
    return ip;
}

function isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || now > record.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    if (record.count >= RATE_LIMIT_MAX) return true;

    record.count++;
    return false;
}

// ─── Middleware ────────────────────────────────────────────────────────────
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // API 라우트에만 Rate Limit 적용
    if (pathname.startsWith('/api/')) {
        const key = getRateLimitKey(req);
        if (isRateLimited(key)) {
            return new NextResponse(
                JSON.stringify({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': '60',
                    },
                }
            );
        }
    }

    // ─── 보안 응답 헤더 ───────────────────────────────────────────────────
    const response = NextResponse.next();

    // XSS 방어
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    // HSTS (HTTPS 강제)
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload'
    );
    // Permissions Policy
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    );

    return response;
}

export const config = {
    matcher: [
        // API 라우트 + 일반 페이지 (정적 파일 제외)
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
    ],
};
