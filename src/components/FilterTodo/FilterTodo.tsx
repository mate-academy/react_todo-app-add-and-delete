import { FC, useContext } from 'react';
import classNames from 'classnames';

import { Status } from '../../types/Status';
import { TodosContext } from '../TodosContext/TodosContext';

export const FilterTodo: FC = () => {
  const { filterStatus, setFilterStatus } = useContext(TodosContext);

  return (
    <>
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterStatus === Status.All,
          })}
          onClick={() => setFilterStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Active,
          })}
          onClick={() => setFilterStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Completed,
          })}
          onClick={() => setFilterStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>
    </>
  );
};
