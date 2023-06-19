import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Type } from '../../types/TodoTypes';

type Props = {
  todos: Todo[],
  selectType: Type,
  onClickType: (selectType: Type) => void,
  /* clearTodos: () => void, */
};

export const Footer: React.FC<Props> = ({
  todos, selectType, onClickType,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${(todos.filter(todo => !todo.completed)).length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectType === 'All' },
          )}
          onClick={(event) => {
            event.preventDefault();
            onClickType(Type.All);
          }}
        >
          {Type.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectType === 'Active' },
          )}
          onClick={(event) => {
            event.preventDefault();
            onClickType(Type.ACTIVE);
          }}
        >
          {Type.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectType === 'Completed' },
          )}
          onClick={(event) => {
            event.preventDefault();
            onClickType(Type.COMPLETED);
          }}
        >
          {Type.COMPLETED}
        </a>
      </nav>

      {(todos.some(todo => todo.completed)) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          /* onClick={clearTodos} */
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
