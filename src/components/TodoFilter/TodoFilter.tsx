import React from 'react';
import classNames from 'classnames';

import { FilterType } from '../../types/FilterTypes';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  selectedType: FilterType;
  onSelectedType: (filter: FilterType) => void;
  onClearCompleted: () => void
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  selectedType,
  onSelectedType,
  onClearCompleted,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <>
      <span className="todo-count">
        {`${itemsLeft.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedType === FilterType.ALL },
          )}
          onClick={() => onSelectedType(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedType === FilterType.ACTIVE },
          )}
          onClick={() => onSelectedType(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedType === FilterType.COMPLETED },
          )}
          onClick={() => onSelectedType(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </>
  );
};
