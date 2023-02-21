import React from 'react';
import cn from 'classnames';
import { AddTodoForm } from '../AddTodo/AddTodo';
import { Todo } from '../../types/Todo';

type Props = {
  query: string
  setQuery: (value: string) => void;
  isAllTodosActive: boolean,
  isTodosNotEmpty: boolean,
  addTodo: (titleTodo: string) => void,
  tempTodo: Todo | null,
};

export const Header: React.FC<Props> = (
  {
    setQuery,
    query,
    isAllTodosActive,
    isTodosNotEmpty,
    addTodo,
    tempTodo,
  },
) => {
  return (
    <header className="todoapp__header">
      {isTodosNotEmpty && (
        <button
          type="button"
          className={cn('todoapp__toggle-all',
            {
              active: isAllTodosActive,
            })}
          aria-label="Toggle all todos"
        />
      )}

      <AddTodoForm
        query={query}
        setQuery={setQuery}
        addTodo={addTodo}
        tempTodo={tempTodo}
      />
    </header>
  );
};
