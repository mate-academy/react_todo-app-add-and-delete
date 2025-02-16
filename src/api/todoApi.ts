const BASE_URL = 'https://mate.academy/students-api';

export const fetchTodos = async (userId: number) => {
  const response = await fetch(`${BASE_URL}/todos?userId=${userId}`);

  if (!response.ok) {
    throw new Error('Unable to fetch todos');
  }

  return response.json();
};

export const addTodo = async (todo: { title: string; userId: number }) => {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...todo, completed: false }),
  });

  if (!response.ok) {
    throw new Error('Unable to add a todo');
  }

  return response.json();
};

export const deleteTodo = async (id: number) => {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Unable to delete a todo');
  }
};
