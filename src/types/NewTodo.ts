import { Todo } from './Todo';

export type NewTodo = Omit<Todo, 'id'>;
