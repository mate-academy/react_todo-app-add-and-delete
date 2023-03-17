import React from 'react';
import classNames from 'classnames';
import { Todo, Filter, FilterValue } from '../../types';
import {
  countActiveTodos,
  checkCompletedTodos,
  deleteCompletedTodos,
  links,
} from '../../api/todos';

type Props = {
  todos: Todo[],
  filter: Filter,
  setFilter: (filterType: Filter) => void,
};

export const Footer: React.FC<Props> = ({ todos, setFilter, filter }) => {
  const isAnyTodoCompleted = checkCompletedTodos(todos);
  const activeTodosAmount = countActiveTodos(todos);

  const changeFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const filterType = event.currentTarget.textContent as FilterValue;

    if (filterType) {
      setFilter(Filter[filterType]);
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosAmount} items left`}
      </span>

      <nav className="filter">
        {links.map(link => (
          <a
            key={link}
            href={`#/${link.toLowerCase()}`}
            className={classNames(
              'filter__link',
              {
                selected: link === filter,
              },
            )}
            onClick={changeFilter}
          >
            {link}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed-disabled': !isAnyTodoCompleted },
        )}
        onClick={() => deleteCompletedTodos(todos)}
      >
        Clear completed
      </button>

    </footer>
  );
};
