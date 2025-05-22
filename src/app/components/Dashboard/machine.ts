import { createMachine, assign, assertEvent } from "xstate";
import { PendingProgress, Progress as ProgressType } from "@/lib/types";

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

const currentRange: GoalRange = {
  startDate: new Date("2025-05-01"),
  endDate: new Date("2025-05-31"),
  startGoal: 0,
  endGoal: 1000,
};

const calculateProgressEntries = (range: GoalRange): ProgressType[] => {
  const progressEntries: ProgressType[] = [];
  for (let i = 0; i < 15; i++) {
    const date = new Date(range.startDate);
    date.setDate(date.getDate() + i);

    const goal = calculateGoal(date, range);
    const previousActual = progressEntries[i - 1]?.actual || 0;
    const actual = previousActual + Math.floor(Math.random() * 50);

    progressEntries.push({ actual, goal, date });
  }
  return progressEntries;
};

const chartData = calculateProgressEntries(currentRange);

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
