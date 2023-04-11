import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../enums/FilterType';

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  filterType: FilterType;
  onFilterTypeChange: (newType: FilterType) => void;
  onCompletedDelete: () => void;
};

export const ListFilter: React.FC<Props> = React.memo(({
  activeTodosCount,
  hasCompletedTodos,
  filterType,
  onFilterTypeChange,
  onCompletedDelete,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter">
      {(Object.keys(FilterType) as (keyof typeof FilterType)[]).map(
        typeOfFilter => {
          const type = FilterType[typeOfFilter];

          return (
            <a
              key={type}
              href={type !== 'all'
                ? `#/${type}`
                : '#/'}
              className={classNames(
                'filter__link',
                { selected: filterType === type },
              )}
              onClick={() => onFilterTypeChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </a>
          );
        },
      )}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      onClick={onCompletedDelete}
      style={{
        visibility: `${hasCompletedTodos ? 'visible' : 'hidden'}`,
      }}
    >
      Clear completed
    </button>
  </footer>
));
