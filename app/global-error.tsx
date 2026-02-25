'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[GlobalError]', error);
    }, [error]);

    return (
        <html lang="ko">
            <body className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans">
                <div
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'rgba(239,68,68,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem',
                        }}
                    >
                        <AlertTriangle style={{ width: 32, height: 32, color: '#f87171' }} />
                    </div>
                    <h2 style={{ color: '#fafafa', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        서비스 오류
                    </h2>
                    <p style={{ color: 'rgba(250,250,250,0.4)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {error.message || '예상치 못한 오류가 발생했습니다.'}
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
                            color: 'white', borderRadius: '12px', border: 'none',
                            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        <RotateCcw style={{ width: 16, height: 16 }} />
                        다시 시도
                    </button>
                </div>
            </body>
        </html>
    );
}
