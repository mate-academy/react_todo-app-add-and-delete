import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { createTodo, USER_ID } from '../api/todos';

interface UseAddTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (msg: string) => void;
  mainInputRef: React.RefObject<HTMLInputElement | null>;
}

export const useAddTodo = ({
  setTodos,
  setErrorMessage,
  mainInputRef,
}: UseAddTodoProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        setTimeout(() => {
          mainInputRef.current?.focus();
        }, 0);
      });
  };

  return {
    newTodoTitle,
    setNewTodoTitle,
    isAdding,
    tempTodo,
    handleSubmit,
  };
};
