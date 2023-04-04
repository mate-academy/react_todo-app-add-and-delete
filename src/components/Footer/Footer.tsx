import classNames from 'classnames';
import React from 'react';
import { filterLinks } from '../../helper/filterLinks';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  filter: Filter,
  onFilter: (filter: Filter) => void,
  completedTodos: Todo[],
  activeTodosCount: number,
  deleteCompleted: (todos: Todo[]) => void,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    filter,
    onFilter,
    completedTodos,
    activeTodosCount,
    deleteCompleted,
  }) => {
    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodosCount} items left`}
        </span>

        <nav className="filter">
          {filterLinks.map(link => (
            <a
              key={link.title}
              href={`#/${link.url}`}
              className={classNames(
                'filter__link',
                { selected: filter === link.title },
              )}
              onClick={() => onFilter(link.title as Filter)}
            >
              {link.title}
            </a>
          ))}
        </nav>

        {!!completedTodos.length && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={() => deleteCompleted(completedTodos)}
          >
            Clear completed
          </button>
        )}
      </footer>
    );
  },
);
