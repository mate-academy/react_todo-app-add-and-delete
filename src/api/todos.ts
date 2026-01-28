import { NewTodoDTO } from '../types/NewTodoDTO';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3868;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  const newTodo: NewTodoDTO = {
    title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete<number>(`/todos/${id}`).then((data: number) => {
    if (data !== 1) {
      throw new Error('Todo not found or unable to delete');
    }
  });
};
