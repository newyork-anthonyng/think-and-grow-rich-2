import { createMachine, assign, assertEvent } from "xstate";

const machine = createMachine(
  {
    id: "calendar",
    initial: "pending",
    context: {
      currentDate: null,
      selectedDate: null,
    },
    types: {} as {
      context: {
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
                    actions: 'cacheSelectedDate'
                  },
                },
              },
              opened: {
                on: {
                  CLOSE: {
                    target: "closed",
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
    },
  }
);

export default machine;
