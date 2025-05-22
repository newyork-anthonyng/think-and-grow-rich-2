import { createMachine, assign, assertEvent } from "xstate";
import { PendingProgress, Progress as ProgressType } from "@/lib/types";

const chartData: ProgressType[] = [
  { actual: 186, goal: 200, date: new Date("2025-05-05") },
  { actual: 205, goal: 250, date: new Date("2025-05-06") },
  { actual: 237, goal: 300, date: new Date("2025-05-07") },
  { actual: 373, goal: 350, date: new Date("2025-05-08") },
];

interface GoalRange {
  startDate: Date;
  endDate: Date;
  startGoal: number;
  endGoal: number;
}

const calculateGoal = (date: Date, range: GoalRange): number => {
  const { startDate, endDate, startGoal, endGoal } = range;

  // Ensure date is within range
  if (date < startDate || date > endDate) {
    throw new Error("Date is outside the specified range");
  }

  // Calculate total days in range
  const totalDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalGoalDiff = endGoal - startGoal;

  // Calculate days from start
  const daysFromStart = Math.floor(
    (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate daily increment
  const dailyIncrement = totalGoalDiff / totalDays;

  // Calculate goal for the given date
  return Math.round(startGoal + daysFromStart * dailyIncrement);
};

// Example usage with current data
const currentRange: GoalRange = {
  startDate: new Date("2025-05-01"),
  endDate: new Date("2025-05-31"),
  startGoal: 0,
  endGoal: 1000,
};

const machine = createMachine(
  {
    initial: "idle",
    context: {
      progressEntries: chartData,
    },
    types: {} as {
      context: {
        progressEntries: ProgressType[];
      };
      events: {
        type: "CHANGE_PROGRESS_ENTRIES";
        data: (ProgressType | PendingProgress)[];
      };
    },

    states: {
      idle: {
        on: {
          CHANGE_PROGRESS_ENTRIES: {
            actions: "cacheProgressEntries",
          },
        },
      },
    },
  },
  {
    actions: {
      cacheProgressEntries: assign(({ event }) => {
        assertEvent(event, "CHANGE_PROGRESS_ENTRIES");

        const newProgressEntries = event.data.map((entry) => {
          const isProgress = "goal" in entry;
          const isPendingProgress = !isProgress;
          if (isPendingProgress) {
            return {
              ...entry,
              goal: calculateGoal(entry.date, currentRange),
            };
          }
          return entry;
        });

        const sortedProgressEntries = newProgressEntries.toSorted((a, b) => {
          return a.date.getTime() - b.date.getTime();
        });

        return {
          progressEntries: sortedProgressEntries,
        };
      }),
    },
  }
);

export default machine;
