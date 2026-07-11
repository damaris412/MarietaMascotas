"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PeakDaysChart({ data }: { data: { day: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sage-200)" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--color-ink)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "var(--color-ink)" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-sage-200)", fontSize: 13 }} />
        <Bar dataKey="count" fill="var(--color-beige-300)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PeakHoursChart({ data }: { data: { hour: number; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-sage-500)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--color-sage-500)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sage-200)" vertical={false} />
        <XAxis
          dataKey="hour"
          tickFormatter={(h) => `${h}h`}
          tick={{ fontSize: 11, fill: "var(--color-ink)" }}
          axisLine={false}
          tickLine={false}
          interval={2}
        />
        <YAxis tick={{ fontSize: 12, fill: "var(--color-ink)" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
        <Tooltip
          labelFormatter={(h) => `${h}:00 h`}
          contentStyle={{ borderRadius: 12, border: "1px solid var(--color-sage-200)", fontSize: 13 }}
        />
        <Area type="monotone" dataKey="count" stroke="var(--color-sage-600)" fill="url(#hourGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
