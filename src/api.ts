export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

const API_URL = 'https://mate.academy/students-api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getTodos(userId: number): Promise<Todo[]> {
  return request<Todo[]>(`/todos?userId=${userId}`);
}

export function createTodo(title: string, userId: number): Promise<Todo> {
  return request<Todo>('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      title,
      userId,
      completed: false,
    }),
  });
}

export function deleteTodo(id: number): Promise<unknown> {
  return request<unknown>(`/todos/${id}`, {
    method: 'DELETE',
  });
}
