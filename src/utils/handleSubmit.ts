import React from 'react';
import { addTodo, USER_ID } from '../todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/hooks/errorMessage';

interface HandleSubmitArgs {
  event: React.FormEvent;
  newTitle: string;
  setNewTitle: (title: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: (msg: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const handleSubmit = ({
  event,
  newTitle,
  setNewTitle,
  setTempTodo,
  setIsAdding,
  setErrorMessage,
  setTodos,
  inputRef,
}: HandleSubmitArgs) => {
  event.preventDefault();
  const trimmedTitle = newTitle.trim();

  if (!trimmedTitle) {
    setErrorMessage(ErrorMessage.TitleShouldNotBeEmpty);
    setTimeout(() => setErrorMessage(''), 3000);

    return;
  }

  const newTodoData = {
    title: trimmedTitle,
    completed: false,
    userId: USER_ID,
  };

  setTempTodo({
    id: 0,
    ...newTodoData,
  });

  setIsAdding(true);

  addTodo(newTodoData)
    .then(createdTodo => {
      setTodos(prev => [...prev, createdTodo]);
      setNewTitle('');
      setTempTodo(null);
    })
    .catch(() => {
      setErrorMessage(ErrorMessage.UnableToAdd);
      setTimeout(() => setErrorMessage(''), 3000);
      setTempTodo(null);
    })
    .finally(() => {
      setIsAdding(false);
      inputRef.current?.focus();
    });
};
