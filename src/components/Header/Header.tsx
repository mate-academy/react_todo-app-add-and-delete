import React from 'react';
import { Todo } from '../../types/Todo';
import { AddTodoForm } from '../AddTodoForm';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  handleSubmit: () => void;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = (
  {
    setQuery,
    query,
    handleSubmit,
    tempTodo,
  },
) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="some label"
      />
      <AddTodoForm
        setQuery={setQuery}
        query={query}
        handleSubmit={handleSubmit}
        tempTodo={tempTodo}
      />
    </header>
  );
};
