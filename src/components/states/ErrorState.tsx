interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex min-w-0 flex-col gap-3 rounded-lg border border-red-300/30 bg-red-500/10 p-4 text-sm text-white backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="min-w-0 break-words">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="w-fit rounded-lg bg-white/10 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
      >
        Tentar novamente
      </button>
    </div>
  );
}
