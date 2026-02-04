import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Registra o erro no console para debug
    console.error('Erro capturado:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-dark-900 border border-dark-800 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-danger-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-danger-400" />
            </div>

            <h1 className="text-2xl font-bold text-dark-50 mb-2">
              Algo deu errado!
            </h1>

            <p className="text-dark-300 mb-6">
              Ocorreu um erro inesperado na aplicação. Tente recarregar a página.
            </p>

            {this.state.error && (
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-mono text-danger-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={this.handleReset}
                className="flex-1"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                Ir para Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
