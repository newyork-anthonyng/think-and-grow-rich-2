import { createMachine, assign, assertEvent } from "xstate";

const machine = createMachine(
  {
    id: "calendar",
    initial: "pending",
    context: {
      date: null,
    },
    types: {} as {
      context: {
        date: Date | null;
      };
    },
    states: {
      pending: {
        always: {
          target: "idle",
          actions: "cacheTodaysDate",
        },
      },
      idle: {},
    },
  },
  {
    actions: {
      cacheTodaysDate: assign(() => {
        return {
          date: new Date(),
        };
      }),
    },
  }
);

export default machine;
