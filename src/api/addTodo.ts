import { client } from '../utils/fetchClient';
import { Todo, NewTodo } from '../types/Todo';
import { USER_ID } from '../App';

export const addTodo = async (inputValue: string) => {
  const newTodo: NewTodo = {
    userId: USER_ID,
    title: inputValue,
    completed: false,
  };

  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};
