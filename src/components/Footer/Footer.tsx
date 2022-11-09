import classNames from 'classnames';
import React, { useMemo } from 'react';

import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  sortType: SortType;
  setSortType: (item: SortType) => void;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  sortType,
  setSortType,
  clearCompletedTodos,
}) => {
  const todosLeft = useMemo(() => (
    todos.filter(({ completed }) => !completed).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const sortTypeArray = Object.values(SortType);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {sortTypeArray.map(type => (
          <a
            key={type}
            data-cy={`FilterLink${type}`}
            href={`#/${type}`}
            className={classNames(
              'filter__link',
              { selected: sortType === type },
            )}
            onClick={() => setSortType(type)}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompletedTodos}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
