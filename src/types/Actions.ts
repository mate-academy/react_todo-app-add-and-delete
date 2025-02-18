/* eslint-disable prettier/prettier */
import { FilterType } from './Filters';
import { Todo } from './Todo';

export const ACTIONS = {
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  RENAME_TODO: 'RENAME_TODO',
  DELETE_TODO: 'DELETE_TODO',
  SET_FILTER: 'SET_FILTER',
  TOGGLE_TODO: 'TOGGLE_TODO',
  TOGGLE_ALL: 'TOGGLE_ALL',
  DELETE_COMPLETED: 'DELETE_COMPLETED',
  UPDATE_ID: 'UPDATE_ID',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  REMOVE_TEMP_TODO: 'REMOVE_TEMP_TODO',
  SET_TEMP_TODO: 'SET_TEMP_TODO',
} as const;

export type Action =
  | { type: typeof ACTIONS.ADD_TODO; payload: Todo }
  | { type: typeof ACTIONS.RENAME_TODO; payload: { id: number; title: string } }
  | { type: typeof ACTIONS.DELETE_TODO; payload: { id: number } }
  | { type: typeof ACTIONS.SET_FILTER; payload: FilterType }
  | { type: typeof ACTIONS.TOGGLE_TODO;
    payload: {
      id: number,
      completed: boolean
    }
  }
  | { type: typeof ACTIONS.TOGGLE_ALL; payload: Todo[] }
  | { type: typeof ACTIONS.DELETE_COMPLETED; payload: Todo[] }
  | { type: typeof ACTIONS.SET_TODOS; payload: Todo[]}
  | { type: typeof ACTIONS.UPDATE_ID; payload: { id: number; tempId: number}}
  | { type: typeof ACTIONS.SET_LOADING; payload: boolean }
  | { type: typeof ACTIONS.SET_ERROR; payload: boolean }
  | { type: typeof ACTIONS.SET_TEMP_TODO; payload: Todo }
  | { type: typeof ACTIONS.REMOVE_TEMP_TODO; payload: null };
