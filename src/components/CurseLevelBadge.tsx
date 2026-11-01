interface CurseLevelBadgeProps {
  curseLevel: number;
}

export function CurseLevelBadge({ curseLevel }: CurseLevelBadgeProps) {
  return (
    <span className="curse-level-badge" aria-label={`Curse level: ${curseLevel}`}>
      {curseLevel}
    </span>
  );
}
