import classNames from 'classnames';
import React, { FC } from 'react';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  category: Filter;
  onChange: (category: Filter) => void;
  onDelete: () => void;
}

export const FooterTodoApp: FC<Props> = React.memo(({
  todos,
  category,
  onChange,
  onDelete,
}) => {
  const leftItems = todos.filter(({ completed }) => completed === false).length;
  const areActive = todos.length - leftItems <= 0;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftItems} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: category === Filter.All,
          })}
          onClick={() => onChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: category === Filter.Active,
          })}
          onClick={() => onChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: category === Filter.Completed,
          })}
          onClick={() => onChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          notification: areActive,
          hidden: areActive,
        })}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
});
