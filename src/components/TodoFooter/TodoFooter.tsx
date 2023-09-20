import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/TodoStatus';
import { getActiveTodoQuantity } from './helpers';
import { Todo } from '../../types/Todo';

interface Props {
  onTypeChange: (type: FilterType) => void;
  filterType: FilterType
  todos: Todo[]
}

export const TodoFooter: React.FC<Props> = (
  {
    onTypeChange,
    filterType,
    todos,
  },
) => {
  const quantityOfActiveTodos = getActiveTodoQuantity();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {
          `${quantityOfActiveTodos} items left`
        }
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {Object.values(FilterType)
          .map(type => (
            <a
              key={type}
              href="#/"
              className={classNames(
                'filter__link',
                {
                  selected: type === filterType,
                },
              )}
              onClick={() => onTypeChange(type)}
            >
              {type}
            </a>
          ))}
      </nav>

      {(quantityOfActiveTodos !== todos.length) && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}
    </footer>
  );
};
