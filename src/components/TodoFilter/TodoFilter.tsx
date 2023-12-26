import React, { useContext } from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../../Store';
import { filters } from '../../lib/filters';

export const TodoFilter: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { filter } = useContext(StateContext);

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(f => (
        <a
          key={f.title}
          href={f.link}
          data-cy={f.dataCy}
          className={cn('filter__link', { selected: f.title === filter.title })}
          onClick={() => dispatch({ type: 'setFilter', payload: f })}
        >
          {f.title}
        </a>
      ))}
    </nav>
  );
};
