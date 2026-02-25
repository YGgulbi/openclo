'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary]', error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
                    <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">오류가 발생했습니다</h2>
                        <p className="text-white/40 text-sm mb-6">
                            {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false });
                                window.location.reload();
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            새로고침
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
