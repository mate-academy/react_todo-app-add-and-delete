import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type FilterTodosProps = {
  handleSelectedFilter: (filter: Filter) => void,
  activeFilter: Filter,
};

export const FilterTodos: React.FC<FilterTodosProps>
  = ({ handleSelectedFilter, activeFilter }) => {
    return (
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleSelectedFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleSelectedFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleSelectedFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>
    );
  };
