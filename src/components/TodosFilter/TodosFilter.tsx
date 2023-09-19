import React from 'react';
import classnames from 'classnames';
import { StatusEnum } from '../../types/StatusEnum';

type Props = {
  filter: StatusEnum;
  onChangeFilter: (newFilter: StatusEnum) => void;
};

export const TodosFilter: React.FC<Props> = ({ filter, onChangeFilter }) => (
  <nav className="filters" data-cy="todosFilter">
    <a
      href="#/"
      className={classnames('filter__link', {
        selected: filter === StatusEnum.All,
      })}
      onClick={() => onChangeFilter(StatusEnum.All)}
    >
      All
    </a>
    <a
      href="#/active"
      className={classnames('filter__link', {
        selected: filter === StatusEnum.Active,
      })}
      onClick={() => onChangeFilter(StatusEnum.Active)}
    >
      Active
    </a>
    <a
      href="#/completed"
      className={classnames('filter__link', {
        selected: filter === StatusEnum.Completed,
      })}
      onClick={() => onChangeFilter(StatusEnum.Completed)}
    >
      Completed
    </a>
  </nav>
);
