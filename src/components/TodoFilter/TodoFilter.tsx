import classNames from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';

interface Props {
  filtredBy: FilterOptions,
  onOptionChange: (option: FilterOptions) => void,
}

export const TodoFilter: React.FC<Props> = ({
  filtredBy,
  onOptionChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filtredBy === FilterOptions.ALL },
        )}
        onClick={() => {
          onOptionChange(FilterOptions.ALL);
        }}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filtredBy === FilterOptions.ACTIVE },
        )}
        onClick={() => {
          onOptionChange(FilterOptions.ACTIVE);
        }}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filtredBy === FilterOptions.COMPLETED },
        )}
        onClick={() => {
          onOptionChange(FilterOptions.COMPLETED);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
