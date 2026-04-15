import type { SaveStatus } from "@/lib/hooks/use-auto-save";

export default function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <span className="text-xs font-[family-name:var(--font-label)] flex items-center gap-1">
      {status === "saving" && (
        <span className="text-[var(--color-outline)]">Saving...</span>
      )}
      {status === "saved" && (
        <>
          <span
            className="material-symbols-outlined text-sm text-green-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <span className="text-green-600">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <span className="material-symbols-outlined text-sm text-[var(--color-error)]">
            error
          </span>
          <span className="text-[var(--color-error)]">Save failed</span>
        </>
      )}
    </span>
  );
}
