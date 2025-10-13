import React from 'react';
import { deleteTodo } from '../todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/hooks/errorMessage';

export const handleClearCompleted = (
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: (msg: string) => void,
  setDeletingTodoIds: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  completedIds.forEach(todoId => {
    setDeletingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  });
};
