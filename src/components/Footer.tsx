import classNames from 'classnames';

import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setVisibleTodos: (arg: Todo[]) => void;
  visibleTodos: Todo[];
};

enum FilterType {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}

export const Footer = ({
  todos,
  setVisibleTodos,
  visibleTodos,
}: Props) => {
  const [filterType, setFilterType] = useState(FilterType.All);

  // const tempTodos = useRef('');

  // console.log(tempTodos);

  // useEffect(() => {
  //   tempTodos.current = visibleTodos;
  // }, [visibleTodos]);

  useEffect(() => {
    switch (filterType) {
      case FilterType.All:
        setVisibleTodos(todos);
        break;

      case FilterType.Completed:
        setVisibleTodos(todos.filter((todo) => todo.completed));
        break;

      case FilterType.Active:
        setVisibleTodos(todos.filter((todo) => !todo.completed));
        break;

      default:
        throw new Error('Wrong Type');
    }
  }, [filterType]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${visibleTodos.length} `}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <button
          type="button"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => setFilterType(FilterType.All)}
        >
          All
        </button>

        <button
          type="button"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => setFilterType(FilterType.Active)}
        >
          Active
        </button>
        <button
          type="button"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </button>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
