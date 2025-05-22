import { Progress } from "@/lib/types";
import { isSameDay } from "date-fns";
import { createMachine, assign, assertEvent } from "xstate";

const machine = createMachine(
  {
    id: "calendar",
    initial: "pending",
    context: ({ input }: { input: { data: Progress[] } }) => ({
      progressEntries: input.data,
      currentDate: null,
      selectedDate: null,
    }),
    types: {} as {
      context: {
        progressEntries: Progress[];
        currentDate: Date | null;
        selectedDate: Date | null;
      };
      events:
        | {
            type: "OPEN";
            data: Date;
          }
        | {
            type: "CLOSE";
          }
        | {
            type: "SAVE";
          };
    },
    states: {
      pending: {
        always: {
          target: "idle",
          actions: "cacheTodaysDate",
        },
      },
      idle: {
        type: "parallel",

        states: {
          modal: {
            initial: "closed",
            states: {
              closed: {
                on: {
                  OPEN: {
                    target: "opened",
                    actions: "cacheSelectedDate",
                  },
                },
              },
              opened: {
                on: {
                  CLOSE: {
                    target: "closed",
                  },
                  SAVE: {
                    target: "closed",
                    actions: "saveProgressEntry",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      cacheTodaysDate: assign(() => {
        return {
          currentDate: new Date(),
        };
      }),
      cacheSelectedDate: assign(({ event }) => {
        assertEvent(event, "OPEN");

        return {
          selectedDate: event.data,
        };
      }),
      saveProgressEntry: assign(({ event, context }) => {
        assertEvent(event, "SAVE");

        if (!context.selectedDate) {
          return {};
        }

        const newProgressEntries = [...context.progressEntries];

        const index = newProgressEntries.findIndex(
          (entry) =>
            context.selectedDate && isSameDay(entry.date, context.selectedDate)
        );

        if (index !== -1) {
          newProgressEntries[index].actual = 10;
        } else {
          newProgressEntries.push({
            actual: 10,
            date: context.selectedDate,
            goal: 20,
          });
        }

        return {
          progressEntries: newProgressEntries,
        };
      }),
    },
  }
);

export default machine;
