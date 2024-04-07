import { Todo } from './Todo';

export type Action =
  | { type: 'SHOW_ALL' }
  | { type: 'SHOW_ERROR_MESSAGE'; payload: { message: string } }
  | { type: 'LOAD_TODOS'; payload: Todo[] }
  | { type: 'ADD_NEW_TODO'; payload: { title: string } }
  | { type: 'DELETE_TODO'; payload: { id: number } }
  | { type: 'SHOW_ACTIVE' }
  | { type: 'REMOVE_LOCAL_TODO'; payload: { id: number } }
  | { type: 'SHOW_COMPLETED' };
