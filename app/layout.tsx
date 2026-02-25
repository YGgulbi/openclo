import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://openclo.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: '오픈클로 | 나의 경험을 탐험하다',
    template: '%s | 오픈클로',
  },
  description:
    '당신의 모든 경험을 타임라인으로 기록하고, AI가 숨겨진 강점과 커리어 방향을 분석해드립니다.',
  keywords: ['커리어', '자기분석', '경험', 'AI', '청년', '취업', '강점분석', '인생지도'],
  authors: [{ name: '오픈클로' }],
  creator: '오픈클로',
  openGraph: {
    title: '오픈클로 | 나의 경험을 탐험하다',
    description:
      '당신의 모든 경험을 타임라인으로 기록하고, AI가 숨겨진 강점과 커리어 방향을 분석해드립니다.',
    type: 'website',
    locale: 'ko_KR',
    url: APP_URL,
    siteName: '오픈클로',
  },
  twitter: {
    card: 'summary_large_image',
    title: '오픈클로 | 나의 경험을 탐험하다',
    description: 'AI가 당신의 경험을 분석해 강점과 커리어 방향을 찾아드립니다.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* Pretendard 공식 CDN */}
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
