import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.round(rating)
                ? "fill-beige-300 text-beige-300"
                : "fill-sage-100 text-sage-100"
            )}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-ink/50">({count})</span>
      )}
    </div>
  );
}
