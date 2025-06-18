import { Todo } from './Todo';

export type TodoModify = Omit<Todo, 'id'>;
