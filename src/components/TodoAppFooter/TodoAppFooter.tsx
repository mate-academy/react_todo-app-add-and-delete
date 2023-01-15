import classNames from 'classnames';
import React from 'react';
import { SortType } from '../../types/SortType';

interface Props {
  selectParametr: string,
  setSelectParametr: (param: SortType) => void,
  activeTodosLength: number,
  completTodoLength: number,
  handleDeleteCompleted: () => void;
}

export const TodoAppFooter: React.FC<Props> = ({
  selectParametr,
  setSelectParametr,
  activeTodosLength,
  completTodoLength,
  handleDeleteCompleted,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const { title } = event.currentTarget;

    setSelectParametr(title as SortType);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          title={SortType.all}
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: selectParametr === SortType.all },
          )}
          onClick={handleClick}
        >
          All
        </a>

        <a
          title={SortType.active}
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: selectParametr === SortType.active },
          )}
          onClick={handleClick}
        >
          Active
        </a>

        <a
          title={SortType.completed}
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: selectParametr === SortType.completed },
          )}
          onClick={handleClick}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: completTodoLength === 0 ? 'hidden' : 'visible' }}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
