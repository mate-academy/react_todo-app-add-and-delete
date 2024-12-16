import React, { useEffect, useRef, useState } from 'react';
import { Errors } from '../../utils/Errors';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  title: string;
  setTitle: (title: string) => void;
  hasError: Errors;
  setHasError: (hasError: Errors) => void;
  USER_ID: number;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (todo: Todo | null) => void;
  tempTodo: Todo | null;
  inputRef: React.RefObject<HTMLInputElement>;
  isDeleteAllCompleted: boolean;
}

export const Header: React.FC<Props> = props => {
  const {
    title,
    setTitle,
    setHasError,
    USER_ID,
    todos,
    setTodos,
    setTempTodo,
    tempTodo,
    inputRef,
    isDeleteAllCompleted,
  } = props;
  const [isDisabled, setIsDisabled] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasError(Errors.NoError);

    if (!title.trim()) {
      setHasError(Errors.TitleEmpty);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setHasError(Errors.NoError);
      }, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    setIsDisabled(true);

    try {
      await addTodo(newTodo);
      setTodos([...todos, newTodo]);
      setIsDisabled(false);
      setTitle('');
      setTempTodo(null);

      inputRef.current?.focus();
    } catch {
      setHasError(Errors.UnableToAdd);
      setTempTodo(null);
      setIsDisabled(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setHasError(Errors.NoError);
      }, 3000);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo, isDeleteAllCompleted]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
