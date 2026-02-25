import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '오픈클로 | 나의 경험을 탐험하다',
  description:
    '당신의 모든 경험을 시각화하고 AI가 숨겨진 강점과 커리어 방향을 분석해드립니다.',
  keywords: ['커리어', '자기분석', '경험', 'AI', '청년', '취업'],
  openGraph: {
    title: '오픈클로 | 나의 경험을 탐험하다',
    description:
      '당신의 모든 경험을 시각화하고 AI가 숨겨진 강점과 커리어 방향을 분석해드립니다.',
    type: 'website',
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
        <link
          href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-pretendard antialiased">{children}</body>
    </html>
  );
}
