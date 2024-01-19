import { Todo } from './Todo';

export type CreateTodo = Omit< Todo, 'id' | 'userId' | 'completed'>;
