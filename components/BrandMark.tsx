export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand brand--compact" : "brand"}>
      <svg
        className="brand__mark"
        viewBox="0 0 44 44"
        role="img"
        aria-label="Aegis-schild"
      >
        <path d="M5 8 23 1v17L5 25V8Z" />
        <path d="m21 20 18-7v19l-18 11V20Z" />
      </svg>
      <span className="brand__word">AEGIS</span>
    </span>
  );
}
