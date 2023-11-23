import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  USER_ID: number;
  toggleAll: boolean;
  handleToggleAll: () => void;
  setErrorMessage: (arg: string) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  USER_ID,
  toggleAll,
  handleToggleAll,
  setErrorMessage,
  tempTodo,
  setTempTodo,
}) => {
  const [query, setQuery] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if ((inputRef.current) && (tempTodo === null)) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  function addTodo({ userId, title, completed }: Todo) {
    const tempId = Date.now();
    const currentTempTodo = {
      userId,
      title,
      completed,
      id: tempId,
    };

    setTempTodo(currentTempTodo);
    setDisabledInput(true);
    setErrorMessage('');

    createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTempTodo(null);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setDisabledInput(false);
      });
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addTodo({
      id: todos.length,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          aria-label="button"
          type="button"
          className={`todoapp__toggle-all ${toggleAll ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleTitleChange}
          style={{ outline: 'none' }}
          ref={inputRef}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
