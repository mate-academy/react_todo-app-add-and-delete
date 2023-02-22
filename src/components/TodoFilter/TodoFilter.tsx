import React from 'react';
import { FilterType } from '../../types/FilterTypes';

type Props = {
  sortBy: string,
  handleSortBy: (value: FilterType) => void,
  searchQuery: string,
  handleQuery: (value: string) => void,
  handleClearQuery: (value: string) => void,
};

// eslint-disable-next-line max-len
export const TodoFilter: React.FC<Props> = React.memo((
  {
    sortBy,
    handleSortBy,
    searchQuery,
    handleQuery,
    handleClearQuery,
  },
) => {
  return (
    <form className="field has-addons">
      <p className="control">
        <span className="select">
          <select
            data-cy="statusSelect"
            value={sortBy}
            onChange={(e) => {
              handleSortBy(e.target.value as FilterType);
            }}
          >
            <option value={FilterType.ALL}>All</option>
            <option value={FilterType.ACTIVE}>Active</option>
            <option value={FilterType.COMPLETED}>Completed</option>
          </select>
        </span>
      </p>

      <p className="control is-expanded has-icons-left has-icons-right">
        <input
          data-cy="searchInput"
          type="text"
          className="input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            handleQuery(e.target.value);
          }}
        />
        <span className="icon is-left">
          <i className="fas fa-magnifying-glass" />
        </span>

        {searchQuery && (
          <span className="icon is-right" style={{ pointerEvents: 'all' }}>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              data-cy="clearSearchButton"
              type="button"
              className="delete"
              onClick={() => {
                handleClearQuery('');
              }}
            />
          </span>
        )}
      </p>
    </form>
  );
});
