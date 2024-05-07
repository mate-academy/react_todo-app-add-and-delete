import { TodoType } from './TodoType';

export type TodoListType = {
  todos: TodoType[];
  tempTodo: TodoType | null;
};
