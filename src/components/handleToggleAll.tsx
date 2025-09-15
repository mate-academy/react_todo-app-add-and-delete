import { Todo } from '../types/Todo';
import { client as fetchClient } from '../utils/fetchClient';
import React from 'react';

type Props = {
  todos: Todo[];
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
};

export const handleToggleAll = ({
  todos,
  setProcessingIds,
  setTodos,
  setError,
  setErrorType,
}: Props) => {
  const allCompleted = todos.every(todo => todo.completed);
  const newCompletedStatus = !allCompleted;

  setProcessingIds(todos.map(todo => todo.id));

  Promise.allSettled(
    todos.map(todo =>
      fetchClient.patch(`/todos/${todo.id}`, {
        completed: newCompletedStatus,
      }),
    ),
  )
    .then(results => {
      const updatedTodos = todos.map((todo, index) => ({
        ...todo,
        completed:
          results[index].status === 'fulfilled'
            ? newCompletedStatus
            : todo.completed,
      }));

      setTodos(updatedTodos);
    })
    .catch(() => {
      setError(true);
      setErrorType('update');
    })
    .finally(() => {
      setProcessingIds([]);
    });
};
