import React from 'react';
import classNames from 'classnames';
import { EnumTodoFilter } from '../../types';

type Props = {
  filter: EnumTodoFilter;
  onChange: (newFilter: EnumTodoFilter) => void;
};

export const TodoFilter: React.FC<Props> = React.memo(({
  filter,
  onChange,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filter === EnumTodoFilter.ALL,
      })}
      onClick={() => onChange(EnumTodoFilter.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: filter === EnumTodoFilter.ACTIVE,
      })}
      onClick={() => onChange(EnumTodoFilter.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: filter === EnumTodoFilter.COMPLETED,
      })}
      onClick={() => onChange(EnumTodoFilter.COMPLETED)}
    >
      Completed
    </a>
  </nav>
));
