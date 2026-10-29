interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/85 backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/25 border-t-accent-400"
      />
      <span>{message}</span>
    </div>
  );
}
