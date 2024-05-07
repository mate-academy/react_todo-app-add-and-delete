import { TodoType } from './TodoType';

export type TodoItemType = {
  todo: TodoType;
  tempTodo?: TodoType | null;
};
