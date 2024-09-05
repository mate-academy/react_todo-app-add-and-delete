import React from 'react';

import classNames from 'classnames';
import { TodoFilter } from '../../types/filter';
import { Todo } from '../../types/Todo';

type Props = {
  sortFilter: TodoFilter;
  setSortFilter: (value: TodoFilter) => void;
  activeTodosCounter: number;
  notActiveTodosCounter: number;
  todos: Todo[];
  handleDelete: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  sortFilter,
  setSortFilter,
  activeTodosCounter,
  notActiveTodosCounter,
  todos,
  handleDelete,
}) => {
  const handleDeleteCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDelete(todo.id);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(filter => (
          <a
            key={filter}
            href="#/"
            className={classNames('filter__link', {
              selected: sortFilter === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => {
              setSortFilter(filter);
            }}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={notActiveTodosCounter === 0}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
