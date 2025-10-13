import React from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../todos';
import { ErrorMessage } from '../types/hooks/errorMessage';

export const handleToggle = async (
  id: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    const response = await fetch(
      `https://mate.academy/students-api/todos/${id}?userId=${USER_ID}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todoToUpdate.completed,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(ErrorMessage.UnableToUpdate);
    }

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  } catch {
    setErrorMessage(ErrorMessage.UnableToUpdate);
  }
};
