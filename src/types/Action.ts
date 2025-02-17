/* eslint-disable @typescript-eslint/indent */
import { Filter } from './Filter';
import { Todo } from './Todo';

export type Action =
  | { type: 'LOAD_TODOS_FROM_SERVER'; payload: Todo[] }
  | {
      type: 'UPDATE_ERROR_STATUS';
      payload: {
        type: string;
      };
    }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_TARGET_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: Filter }
  | { type: 'SET_INPUT_DISABLED'; payload: boolean }
  | {
      type: 'SET_TODO_DISABLED';
      payload: {
        value: boolean;
        targetId: number;
      };
    }
  | { type: 'CREATE_TEMP_TODO'; payload: { id: number; title: string } | null };
