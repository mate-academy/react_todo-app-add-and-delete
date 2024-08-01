import React, { useEffect, useRef, useState } from 'react';
import { createTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setTempTodo: (todo: Todo | null) => void;
  setErrorMessage: (errorMessage: string) => void;
  setIsLoadingId: (id: number | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTempTodo,
  setErrorMessage,
  setIsLoadingId,
}) => {
  const [query, setQuery] = useState('');

  const textField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, [todos]);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trimStart());
  };

  const handleCreateTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoadingId(0);

    if (!query) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
        setIsLoadingId(null);
      }, 3000);

      return;
    }

    setTempTodo({
      id: 0,
      title: query,
      userId: USER_ID,
      completed: false,
    });

    createTodo({
      completed: false,
      title: query,
      userId: USER_ID,
    })
      .then(() => {
        setQuery('');
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsLoadingId(null));
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
      <form onSubmit={handleCreateTodo}>
        <input
          ref={textField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeQuery}
        />
      </form>
    </header>
  );
};
