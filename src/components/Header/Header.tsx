import React, { useEffect, useRef, useState } from 'react';
import { client } from '../../utils/fetchClient';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (el: Todo | null) => void;
  isLoading: boolean;
  setIsLoading: (el: boolean) => void;
  isAdding: boolean;
  setIsAdding: (el: boolean) => void;
  statusFilter: string;
  isError: boolean;
  setIsError: (el: boolean) => void;
  setErrorMessage: (el: string) => void;
  USER_ID: number;
  onCreate: () => void;
  ErrorMessages: {
    None: string;
    Load: string;
    Empty: string;
    Add: string;
    Delete: string;
  };
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setTempTodo,
  isLoading,
  setIsLoading,
  isAdding,
  setIsAdding,
  setIsError,
  setErrorMessage,
  USER_ID,
  onCreate,
  ErrorMessages,
}) => {
  const [title, setTitle] = useState('');
  // const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding && !isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isAdding, isLoading]);

  const addTodo = async () => {
    const trimmedTitle = title.trim();

    setErrorMessage('');

    if (!trimmedTitle) {
      setIsError(true);
      setErrorMessage(ErrorMessages.Empty);

      return false;
    } else {
      setIsError(false);
      setIsLoading(true);
      setIsAdding(true);
      const el = {
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      try {
        const createdTodo: Todo = await client.post(`/todos`, el);

        setTempTodo(null);
        setTodos([...(todos || []), createdTodo]);
        setTitle('');
        onCreate();
        // return createdTodo;
      } catch {
        setIsError(true);
        setErrorMessage(ErrorMessages.Add);
        throw new Error(ErrorMessages.Add);
      } finally {
        // setIsFocused(true);
        setIsLoading(false);
        setIsAdding(false);
      }
    }
  };

  const createTempTodo = () => {
    const tempTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    if (todos) {
      setTempTodo(tempTodo);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={async event => {
          event.preventDefault();
          createTempTodo();
          await addTodo();
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading || isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
