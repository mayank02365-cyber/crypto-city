import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'Please check your internet connection or try again.',
  onRetry,
}) => (
  <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 my-4">
    <div className="w-12 h-12 rounded-2xl bg-negative/15 flex items-center justify-center text-negative">
      <AlertCircle size={24} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-text-primary">{title}</h3>
      <p className="text-xs text-text-muted mt-1 max-w-sm">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-primary text-xs h-8 px-4 gap-2 shadow-glow-accent"
      >
        <RefreshCw size={14} /> Retry
      </button>
    )}
  </div>
);
