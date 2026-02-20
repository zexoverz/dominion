export default function TypeBadges({ types }: { types: number[] }) {
  return (
    <span className="inline-flex gap-1">
      {types.map((t) => (
        <img
          key={t}
          src={`/assets/pokemon/type-${t}.png`}
          alt={`type-${t}`}
          className="type-badge pixel"
          style={{ imageRendering: 'pixelated', height: 14 }}
        />
      ))}
    </span>
  );
}
