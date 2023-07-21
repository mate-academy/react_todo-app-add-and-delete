import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[],
  selectItem: Status,
  setSelectItem: React.Dispatch<React.SetStateAction<Status>>
};

export const Footer: React.FC<Props> = ({
  todos,
  selectItem,
  setSelectItem,
}) => {
  const isActiveTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${isActiveTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectItem === Status.ALL,
          })}
          onClick={() => setSelectItem(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectItem === Status.ACTIVE,
          })}
          onClick={() => setSelectItem(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectItem === Status.COMPLETED,
          })}
          onClick={() => setSelectItem(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {!!todos.filter(todo => todo.completed).length && (
        <button
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
