import { Filter, Todo } from '../model/types';

export const ACTIONS = {
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  SET_TEMP_TODO: 'SET_TEMP_TODO',
  DELETE_TODO: 'DELETE_TODO',
  RENAME_TODO: 'RENAME_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  TOGGLE_ALL: 'TOGGLE_ALL',
  SET_FILTER: 'SET_FILTER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
} as const;

export type Action =
  | { type: typeof ACTIONS.SET_TODOS; payload: Todo[] }
  | { type: typeof ACTIONS.ADD_TODO; payload: Todo }
  | { type: typeof ACTIONS.SET_TEMP_TODO; payload: Todo | null }
  | { type: typeof ACTIONS.DELETE_TODO; payload: { id: number } }
  /* eslint-disable @typescript-eslint/indent */
  | {
      type: typeof ACTIONS.RENAME_TODO;
      payload: { id: number; title: string };
    }
  | {
      type: typeof ACTIONS.TOGGLE_TODO;
      payload: { id: number; completed: boolean };
    }
  /* eslint-enable @typescript-eslint/indent */
  | { type: typeof ACTIONS.TOGGLE_ALL }
  | { type: typeof ACTIONS.SET_FILTER; payload: Filter }
  | { type: typeof ACTIONS.SET_LOADING; payload: boolean }
  | { type: typeof ACTIONS.SET_ERROR; payload: boolean };
