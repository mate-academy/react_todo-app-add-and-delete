import { addTodo, deleteTodo, getTodos, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

export interface TodoService {
  getTodos: () => Promise<Todo[]>;
  addTodo: (todoTitle: string) => Promise<Todo>;
  deleteTodo: (todoId: number) => Promise<void>;
}

export const TodoServiceApi: TodoService = {
  getTodos: () => getTodos(),
  addTodo: (todoTitle: string) =>
    addTodo({
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    }),
  deleteTodo: (todoId: number) => deleteTodo(todoId).then(() => {}),
};
