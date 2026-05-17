import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('Markab caught a render error:', error, info.componentStack);
    }

    private handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        const { error } = this.state;
        if (!error) return this.props.children;

        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-newtab-surface px-6 text-newtab-text-primary">
                <div className="max-w-md space-y-4 rounded-lg border border-newtab-border bg-newtab-surface-elevated p-6 shadow-lg">
                    <h1 className="text-lg font-semibold">Something went wrong</h1>
                    <p className="text-sm text-newtab-text-secondary">{error.message}</p>
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
