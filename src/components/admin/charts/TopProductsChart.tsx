"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TopProductsChart({
  data,
}: {
  data: { title: string; quantity: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sage-200)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: "var(--color-ink)" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="title"
          width={140}
          tick={{ fontSize: 12, fill: "var(--color-ink)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--color-sage-200)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="quantity" fill="var(--color-english-700)" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
