import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
    fallbackName?: string;
}

interface State {
    hasError: boolean;
}

class AIErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("AI Error Boundary caught an error:", error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-red-200 rounded-xl bg-red-50 text-red-900 min-h-[200px]">
                    <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
                    <h3 className="text-lg font-semibold mb-2">Oups ! L'assistant a rencontré un problème</h3>
                    <p className="text-sm text-center mb-4 opacity-80">
                        Une erreur est survenue lors du chargement de {this.props.fallbackName || "ce module"}.
                    </p>
                    <Button
                        onClick={this.handleRetry}
                        variant="outline"
                        className="flex items-center gap-2 border-red-200 hover:bg-red-100"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Réessayer
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AIErrorBoundary;
