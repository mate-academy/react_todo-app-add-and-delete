import classNames from 'classnames';
import React, { useContext } from 'react';
import { Filtering } from '../../types/Filtering';
import { MyContext, MyContextData } from '../context/myContext';
import { Todo } from '../../types/Todo';

interface Props {
  filterType: Filtering;
  handleClick: (arg: Filtering) => void;
}

export const Footer: React.FC<Props> = ({ filterType, handleClick }) => {
  const { data, handleSetTodosDelete } = useContext(MyContext) as MyContextData;

  const itemsLeft = `${data.length - data.filter((elem: Todo) => elem.completed).length} items left`;
  const hasCompletedItems = data.find(elem => elem.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filterType === Filtering.ALL,
          })}
          onClick={() => handleClick(Filtering.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === Filtering.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleClick(Filtering.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === Filtering.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleClick(Filtering.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedItems}
        onClick={handleSetTodosDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
