import classNames from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';

interface Props {
  selectedOption: FilterOptions,
  onOptionChange: (option: FilterOptions) => void,
}

export const TodoFilter: React.FC<Props> = ({
  selectedOption,
  onOptionChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: selectedOption === FilterOptions.ALL },
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
          { selected: selectedOption === FilterOptions.ACTIVE },
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
          { selected: selectedOption === FilterOptions.COMPLETED },
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
