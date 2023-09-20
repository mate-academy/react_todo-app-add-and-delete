import React, { useContext } from 'react';
import cn from 'classnames';

import { TodosContext } from '../../Context';
import { FiltersType } from '../../types/filterTypes';

import { getActiveTodos } from '../../helpers/getTodos';

export const Footer: React.FC = () => {
  const { todos, filter, setFilter } = useContext(TodosContext);

  const todosNumber = todos.length;
  const activeTodosNumber = getActiveTodos(todos).length;
  const isSomeTodoCompleted = todosNumber !== activeTodosNumber;

  if (!todosNumber) {
    return null;
  }

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosNumber} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {(Object.entries(FiltersType))
          .map(([key, value]) => {
            const url = value === FiltersType.ALL
              ? ''
              : value.toLowerCase();

            return (
              <a
                href={`#/${url}`}
                key={key}
                className={cn('filter__link', {
                  selected: filter === value,
                })}
                onClick={() => setFilter(value)}
              >
                {value}
              </a>
            );
          })}
      </nav>

      {/* don't show this button if there are no completed todos */}

      {isSomeTodoCompleted && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}

    </footer>
  );
};
