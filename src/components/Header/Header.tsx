import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type HeaderProps = {
  todos: Todo[];
  isLoading: boolean;
  isTodoLoading: boolean;
  handleCreateTodo: (
    todo: Todo,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
  todoDeleted: number
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  isLoading,
  isTodoLoading,
  handleCreateTodo,
  todoDeleted
}) => {
  const inputField = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    inputField.current?.focus();
  }, [isTodoLoading, todoDeleted]);

  return (
    <header className="todoapp__header">
      {!isLoading && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          handleCreateTodo(
            {
              title: query,
              id: 0,
              userId: 3085,
              completed: false,
            },
            setQuery,
          );
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={isTodoLoading}
        />
      </form>
    </header>
  );
};
