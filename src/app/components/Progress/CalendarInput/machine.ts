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
      numberInput: null,
    }),
    types: {} as {
      context: {
        progressEntries: Progress[];
        currentDate: Date | null;
        selectedDate: Date | null;
        numberInput: number | null;
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
          }
        | {
            type: "CHANGE_NUMBER_INPUT";
            data: number;
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
                  CHANGE_NUMBER_INPUT: {
                    actions: "changeNumberInput",
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
      cacheSelectedDate: assign(({ event, context }) => {
        assertEvent(event, "OPEN");

        const foundDate = context.progressEntries.find((entry) =>
          isSameDay(entry.date, event.data)
        );
        const numberInput = foundDate?.actual ?? null;

        return {
          selectedDate: event.data,
          numberInput,
        };
      }),
      changeNumberInput: assign(({ event }) => {
        assertEvent(event, "CHANGE_NUMBER_INPUT");

        return {
          numberInput: event.data,
        };
      }),
      saveProgressEntry: assign(({ event, context }) => {
        assertEvent(event, "SAVE");

        if (!context.selectedDate || !context.numberInput) {
          return {};
        }

        const newProgressEntries = [...context.progressEntries];

        const index = newProgressEntries.findIndex(
          (entry) =>
            context.selectedDate && isSameDay(entry.date, context.selectedDate)
        );

        const isExistingEntry = index !== -1;
        if (isExistingEntry) {
          newProgressEntries[index].actual = context.numberInput;
        } else {
          newProgressEntries.push({
            actual: context.numberInput,
            date: context.selectedDate,
            goal: 20,
          });
        }

        return {
          progressEntries: newProgressEntries,
          numberInput: null,
        };
      }),
    },
  }
);

export default machine;
