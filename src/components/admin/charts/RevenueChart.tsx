"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export function RevenueChart({ data }: { data: { label: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sage-200)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "var(--color-ink)" }}
          axisLine={{ stroke: "var(--color-sage-200)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--color-ink)" }}
          axisLine={false}
          tickLine={false}
          width={70}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--color-sage-200)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="total" fill="var(--color-sage-500)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
