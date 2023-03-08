import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 6502;
const API_URL = `https://mate.academy/students-api`;

export function wait(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export const getTodos = (userId: number) => {
  return wait(500).then(() => client.get<Todo[]>(`/todos?userId=${userId}`));
};

// Creates new todo method
export function createTodo(newTodo: Omit<Todo, 'id'>): Promise<Todo> {
  return wait(500)
    .then(() =>
      fetch(`${API_URL}/todos?userId=${USER_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      })
    )
    .then((res) => res.json());
}

// Delete todo method
export function deleteTodos(todoId: number): Promise<void> {
  return wait(500)
    .then(() =>
      fetch(`${API_URL}/todos/${todoId}`, {
        method: 'DELETE',
      })
    )
    .then((res) => res.json());
}
