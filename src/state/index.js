import { createContext } from 'react';
import { assign, Machine } from 'xstate';
import { addbookMachine } from './addbook';
import { removebookMachine } from './removebook';
import { fetchOneBookMachine } from './fetchsinglebook'

import fetchAllBooks from '../api/fetchbooks';

export const MachineContext = createContext();

export const appMachine = Machine({
  id: 'app',
  initial: 'init',
  context: {
    books: [],
    error: undefined,
    fields: '',
  },
  states: {
    init: {},
    addbookMachine,
    removebookMachine,
    fetchOneBookMachine,
    list: {
      states: {
        loading: {
          invoke: {
            id: 'fetchAllBooks',
            src: fetchAllBooks,
            onDone: {
              target: 'success',
              actions: assign({ books: (_context, event) => event.data }),
            },
            onError: {
              target: 'failed',
              actions: assign({ error: (_context, event) => event.data }),
            },
          },
        },
        success: {},
        failed: {},
      },
    },
  },
  on: {
    LOAD_BOOKS: {
      target: 'list.loading',
    },
    ADD_BOOK: {
      target: 'addbookMachine.adding',
    },
    DELETE_BOOK: {
      target: 'removebookMachine.deleting',
      actions: assign((_ctx, evt) => ({
        id: evt.id,
      })),
    },
    FETCH_A_BOOK: {
      target: 'fetchOneBookMachine.fetching',
      actions: assign((_ctx, evt) => ({
        id: evt.id,
      })),
    },
    EDIT_A_BOOK: {
      target: 'fetchOneBookMachine.editing',
      actions: assign((_ctx, evt) => ({
        data: evt.data,
      })),
    },
  },
});
