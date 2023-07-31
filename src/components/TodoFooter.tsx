import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/todoContext';
import { SelectType } from '../enums';

export const TodoFooter: React.FC = () => {
  const {
    itemsLeft,
    visibleButtonClearCompleted,
    select,
    onCompleted,
    onSelect,
  } = useContext(TodoContext);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>
      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: select === SelectType.All,
          })}
          onClick={() => onSelect(SelectType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: select === SelectType.Active,
          })}
          onClick={() => onSelect(SelectType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: select === SelectType.Completed,
          })}
          onClick={() => onSelect(SelectType.Completed)}
        >
          Completed
        </a>
      </nav>

      {visibleButtonClearCompleted > 0 ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onCompleted(true)}
        >
        Clear completed
      </button>
      ) :
      (<button
        style={{visibility: 'hidden'}}
        type="button"
        className="todoapp__clear-completed">
      Clear completed
    </button>)}
    </footer>
  );
};
