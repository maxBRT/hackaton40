import * as React from "react";

type ProgressProps = {
  value?: number; // 0..100
  className?: string;
};

export function Progress({ value = 0, className = "" }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-muted ${className}`}>
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
