export function LoadingSpinner() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="size-12 animate-spin rounded-full border-4 border-emerald-400/20 border-t-emerald-400" />
    </div>
  );
}
