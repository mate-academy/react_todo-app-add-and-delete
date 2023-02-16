import React from 'react';
import cn from 'classnames';
import { AddTodoForm } from '../AddTodoForm';
import { Todo } from '../../types/Todo';

type Props = {
  query: string
  todos: Todo[];
  setQuery: (value: string) => void;
  handleFormSubmit: () => void;
};
export const Header: React.FC<Props> = (
  {
    todos,
    setQuery,
    query,
    handleFormSubmit,
  },
) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          {
            active: activeTodos.length > 0,
          },
        )}
      />

      {/* Add a todo on form submit */}
      <AddTodoForm
        query={query}
        setQuery={setQuery}
        handleFormSubmit={handleFormSubmit}
      />
    </header>
  );
};
