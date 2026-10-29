interface EmptyStateProps {
  title?: string;
  tip?: string;
}

export default function EmptyState({
  title = 'Nenhuma cidade encontrada',
  tip = 'Confira a escrita ou tente outra grafia.',
}: EmptyStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-4 text-white backdrop-blur-md sm:p-5"
    >
      <h2 className="break-words text-base font-semibold">{title}</h2>
      <p className="mt-1 break-words text-sm text-white/80">{tip}</p>
    </section>
  );
}
