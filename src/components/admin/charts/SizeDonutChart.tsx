"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["var(--color-sage-500)", "var(--color-beige-300)", "var(--color-english-700)"];

export function SizeDonutChart({ data }: { data: { size: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="size"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={entry.size} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--color-sage-200)",
            fontSize: 13,
          }}
        />
        <Legend
          formatter={(value) => `Talla ${value}`}
          wrapperStyle={{ fontSize: 13, color: "var(--color-ink)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
