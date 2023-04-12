import React from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { SortType } from '../../types/SortType';

interface Props {
  todos: Todo[],
  sortType: SortType,
  onSelect: (typeOfSort: SortType) => void,
  onClearCompleted: () => void,
}

export const TodoFooter: React.FC<Props> = (props) => {
  const {
    todos,
    sortType,
    onSelect,
    onClearCompleted,
  } = props;

  const handlerSortSelect = (type: SortType) => {
    if (type === sortType) {
      return;
    }

    onSelect(type);
  };

  const hasCompletdTodo = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <nav className="filter">
        {Object.values(SortType).map(type => (
          <a
            href={`#/${
              type === SortType.ALL
                ? ''
                : type
            }`}
            className={classNames(
              'filter__link',
              {
                selected: sortType === type,
              },
            )}
            data-sort={type}
            onClick={() => handlerSortSelect(type)}
            key={type}
          >
            {type[0].toUpperCase() + type.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'is-invisible': !hasCompletdTodo,
          },
        )}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
