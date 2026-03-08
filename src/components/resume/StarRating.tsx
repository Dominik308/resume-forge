"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  level: 1 | 2 | 3 | 4 | 5;
  maxStars?: number;
  size?: "xs" | "sm" | "md";
  color?: string;
  emptyColor?: string;
}

export default function StarRating({
  level,
  maxStars = 5,
  size = "xs",
  color = "#319795",
  emptyColor = "rgba(255,255,255,0.2)",
}: StarRatingProps) {
  const sizeMap = { xs: "h-2.5 w-2.5", sm: "h-3 w-3", md: "h-4 w-4" };
  const cls = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={cls}
          fill={i < level ? color : "transparent"}
          stroke={i < level ? color : emptyColor}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
