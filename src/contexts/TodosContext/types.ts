import { ClientTodo, Todo } from '../../types';

export type Action =
  | { type: 'set'; payload: Todo[] }
  | { type: 'delete'; payload: Todo['id'] }
  | { type: 'setLoad'; payload: Pick<ClientTodo, 'loading' | 'id'> }
  | { type: 'add'; payload: Todo };
