import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Filters } from '../types/filters';

type Props = {
  todos: Todo[];
  filter: Filters;
  onChangeFilter: (filter: Filters) => void;
  handleDeleteCompletedButton: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  filter,
  onChangeFilter,
  handleDeleteCompletedButton,
}) => {
  const count = () => {
    const incompleteTodos = todos.filter(todo => todo.completed === false);

    return incompleteTodos.length;
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${count()} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link ', {
            selected: filter === Filters.ALL,
          })}
          onClick={() => onChangeFilter(Filters.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link ', {
            selected: filter === Filters.ACTIVE,
          })}
          onClick={() => onChangeFilter(Filters.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link ', {
            selected: filter === Filters.COMPLETED,
          })}
          onClick={() => onChangeFilter(Filters.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleDeleteCompletedButton}
      >
        Clear completed
      </button>
    </footer>
  );
};
