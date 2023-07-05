import { Todo } from './Todo';

export type CreatedTodoArgs = Omit<Todo, 'id'>;
