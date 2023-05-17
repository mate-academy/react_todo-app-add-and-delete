import { FC, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { FilterType } from '../../enum/FilterType';
import { Todo } from '../../types/Todo';

interface FooterProps {
  todos: Todo[],
  onStatusSelect: (status: FilterType) => void;
  todoStatus: string;
}

export const Footer: FC<FooterProps> = ({
  todos,
  onStatusSelect,
  todoStatus,
}) => {
  const handleClick = useCallback((
    filter: FilterType,
  ) => {
    onStatusSelect(filter);
  }, []);

  const notCompletedCount = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${notCompletedCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: todoStatus === FilterType.All,

          })}
          onClick={() => handleClick(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: todoStatus === FilterType.Active },
          )}
          onClick={() => handleClick(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: todoStatus === FilterType.Completed },
          )}
          onClick={() => handleClick(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
