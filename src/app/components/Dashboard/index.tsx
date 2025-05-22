"use client";
import DesireWallContainer from "../DesireWall";
import Progress from "../Progress";
import CalendarInput from "../Progress/CalendarInput";
import { Progress as ProgressType } from "@/lib/types";

const chartData: ProgressType[] = [
  { actual: 186, goal: 200, date: new Date("2025-05-05") },
  { actual: 205, goal: 300, date: new Date("2025-05-06") },
  { actual: 237, goal: 350, date: new Date("2025-05-07") },
  { actual: 373, goal: 400, date: new Date("2025-05-08") },
];

function Dashboard() {
  return (
    <div>
      <DesireWallContainer />
      <div className="w-1/2">
        <Progress progressEntries={chartData} />
        <CalendarInput progressEntries={chartData} />
      </div>
    </div>
  );
}

export default Dashboard;