type SystemTraceProps = {
  labels?: string[];
};

export function SystemTrace({
  labels = ["Signaal", "Patroon", "Keuze", "Uitvoering"],
}: SystemTraceProps) {
  const points = [
    { x: 7, y: 58 },
    { x: 34, y: 43 },
    { x: 63, y: 56 },
    { x: 93, y: 36 },
  ];

  return (
    <div className="system-trace" aria-hidden="true">
      <svg viewBox="0 0 100 72" preserveAspectRatio="none">
        <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} />
        {points.map(({ x, y }) => (
          <circle cx={x} cy={y} key={`${x}-${y}`} r="1" />
        ))}
      </svg>
      <div className="system-trace__labels">
        {labels.map((label) => <span key={label}>{label}</span>)}
      </div>
    </div>
  );
}
