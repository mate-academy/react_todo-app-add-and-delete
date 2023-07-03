import { Todo } from './Todo';

export type PostTodo = Omit<Todo, 'id'>;
