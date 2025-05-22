import { createMachine, assign, assertEvent } from "xstate";
import { Progress as ProgressType } from "@/lib/types"; 

const chartData: ProgressType[] = [
  { actual: 186, goal: 200, date: new Date("2025-05-05") },
  { actual: 205, goal: 300, date: new Date("2025-05-06") },
  { actual: 237, goal: 350, date: new Date("2025-05-07") },
  { actual: 373, goal: 400, date: new Date("2025-05-08") },
];

const machine = createMachine({
  initial: "idle",
  context: {
    progressEntries: chartData,
  },
  types: {} as {
    context: {
      progressEntries: ProgressType[];
    }
    events: | {
      type: 'CHANGE_PROGRESS_ENTRIES';
      data: ProgressType[];
    }
  },

  states: {
    idle: {
      on: {
        'CHANGE_PROGRESS_ENTRIES': {
          actions: 'cacheProgressEntries'
        }
      }
    },
  },
}, {
  actions: {
    cacheProgressEntries: assign(({ event }) => {
      assertEvent(event, 'CHANGE_PROGRESS_ENTRIES');

      const sortedProgressEntries = event.data.toSorted((a, b) => {
        return a.date.getTime() - b.date.getTime();
      });

      return {
        progressEntries: sortedProgressEntries
      }
    })
  }
});

export default machine;
