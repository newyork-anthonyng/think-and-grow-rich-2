"use client";

import { Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Progress as ProgressType } from "@/lib/types";

const chartData: ProgressType[] = [
  { actual: 186, goal: 200, date: new Date("2025-01-01") },
  { actual: 205, goal: 300, date: new Date("2025-01-02") },
  { actual: 237, goal: 350, date: new Date("2025-01-03") },
  { actual: 373, goal: 400, date: new Date("2025-01-04") },
];

const chartConfig = {
  actual: {
    label: "Actual",
    color: "#3b82f6",
  },
  goal: {
    label: "Goal",
    color: "#93c5fd",
  },
} satisfies ChartConfig;

function Progress() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="date"
          label={{ value: "Dates", position: "bottom" }}
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <YAxis label={{ value: "Value", angle: -90, position: "left" }} />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--color-actual)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="goal"
          stroke="var(--color-goal)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default Progress;
