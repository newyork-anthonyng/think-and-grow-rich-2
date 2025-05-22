import { createMachine, assign, assertEvent, fromPromise } from 'xstate';

const LOCAL_STORAGE_KEY = 'desireWall';
function getFromLocalStorage() {
  const value = localStorage.getItem(LOCAL_STORAGE_KEY);
  return value ? JSON.parse(value) : null;
}

function setToLocalStorage(value: string) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ value }));
}
const machine = createMachine(
  {
    id: 'desireWall',
    initial: 'pending',
    context: {
      markdown: '',
    },
    types: {} as {
      context: {
        markdown: string;
      };
      events:
        | { type: 'CHANGE_MARKDOWN'; data: string }
        | { type: 'EDIT' }
        | { type: 'VIEW' }
        | { type: 'xstate.done.actor.getFromLocalStorage'; output: { value: string } | null };
    },
    states: {
      pending: {
        invoke: {
          id: 'getFromLocalStorage',
          src: fromPromise(getFromLocalStorage),
          onDone: {
            target: 'viewing',
            actions: 'cacheMarkdownFromLocalStorage',
          },
        },
      },
      viewing: {
        on: {
          EDIT: 'editing',
        },
      },
      editing: {
        on: {
          VIEW: 'viewing',
          CHANGE_MARKDOWN: {
            actions: ['cacheMarkdown', 'saveToLocalStorage'],
          },
        },
      },
    },
  },
  {
    actions: {
      cacheMarkdownFromLocalStorage: assign(({ event }) => {
        assertEvent(event, 'xstate.done.actor.getFromLocalStorage');

        return {
          markdown: event.output?.value ?? '',
        };
      }),
      cacheMarkdown: assign(({ event }) => {
        assertEvent(event, 'CHANGE_MARKDOWN');

        console.log('cacheMarkdown', event.data);

        return {
          markdown: event.data,
        };
      }),
      saveToLocalStorage: ({ context }) => {
        setToLocalStorage(context.markdown);
      },
    },
  },
);

export default machine;
