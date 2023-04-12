import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const URL = 'https://mate.academy/students-api/todos?userId=7010';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoOnServer = async (
  todoData: Omit<Todo, 'id'>,
) => {
  const responce = await fetch(
    URL,
    {
      method: 'post',
      body: JSON.stringify(todoData),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    },
  );

  return responce.json();
};

export const deleteTodoFromServer = async (
  todoId: number,
) => {
  const responce = await fetch(
    `${URL}/${todoId}`,
    {
      method: 'DELETE',
    },
  );

  return responce.json();
};
