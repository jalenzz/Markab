import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    error: unknown;
}

function formatError(error: unknown): string {
    if (error instanceof Error) return error.message || error.name || 'Unknown error';
    if (typeof error === 'string' && error.length > 0) return error;
    return 'Something went wrong.';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: unknown, info: ErrorInfo): void {
        console.error('Markab caught a render error:', error, info.componentStack);
    }

    private handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        const { error } = this.state;
        if (error === null) return this.props.children;

        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-newtab-surface px-6 text-newtab-text-primary">
                <div className="max-w-md space-y-4 rounded-lg border border-newtab-border bg-newtab-surface-elevated p-6 shadow-lg">
                    <h1 className="text-lg font-semibold">Something went wrong</h1>
                    <p className="text-sm text-newtab-text-secondary">{formatError(error)}</p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="rounded-md bg-newtab-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        Reload
                    </button>
                </div>
            </div>
        );
    }
}
