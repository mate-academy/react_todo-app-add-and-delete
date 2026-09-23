import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, USER_ID } from '../api/todos';

type Props = {
  onAdd: (todo: Todo) => void;
  setTempTodo: (todo: Todo | null) => void;
  setIsAdding: (isAdding: boolean) => void;
  isAdding: boolean;
  setErrorMessage: (message: string) => void;
  setFocusCallback: (callback: () => void) => void;
};

export const NewTodo: React.FC<Props> = ({
  onAdd,
  setTempTodo,
  setIsAdding,
  isAdding,
  setErrorMessage,
  setFocusCallback,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFocusCallback(() => {
      inputRef.current?.focus();
    });
  }, [setFocusCallback]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temp);
    setIsAdding(true);

    addTodo(trimmedTitle)
      .then(addedTodo => {
        onAdd(addedTodo);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        inputRef.current?.focus();
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        autoFocus
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
