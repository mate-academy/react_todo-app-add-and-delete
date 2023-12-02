import React from 'react';
import classNames from 'classnames';
import { Filters } from '../Filters/Filters';
import { useAppState } from '../AppState/AppState';
import { getIncompleteTodosCount } from '../function/getIncompleteTodosCount';

export const Footer: React.FC = () => {
  const {
    todos,
  } = useAppState();

  const incompleteTodosCount = getIncompleteTodosCount(todos);

  return (
    <footer
      className={classNames(
        'todoapp__footer',
        {
          hidden: incompleteTodosCount === 0,
        },
      )}
      data-cy="Footer"
    >
      {incompleteTodosCount > 0 && (
        <>
          <span className="todo-count" data-cy="TodosCounter">
            {`${incompleteTodosCount} ${incompleteTodosCount === 1 ? 'item' : 'items'} left`}
          </span>
          <Filters />
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        </>
      )}
    </footer>
  );
};
