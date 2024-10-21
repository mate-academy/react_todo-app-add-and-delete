import React, { useEffect, useRef } from 'react';

import { TypeError } from '../../types/TypeError';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setErrorMessage: (value: React.SetStateAction<TypeError>) => void;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  onAddTodo: (newTodo: Omit<Todo, 'id'>) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  newTitle,
  setNewTitle,
  onAddTodo,
  setLoading,
  loading,
  setTempTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle) {
      setErrorMessage(TypeError.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    const newTemptTodo: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(newTemptTodo);
    setLoading(true);

    onAddTodo(newTodo);
  };

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  return (
    <>
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
            ref={inputRef}
            value={newTitle}
            onChange={event => {
              setNewTitle(event.target.value.trimStart());
            }}
            disabled={loading}
          />
        </form>
      </header>
    </>
  );
};
