import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter,
  setFilter: (filter: Filter) => void,
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Filter.All,
        })}
        onClick={() => setFilter(Filter.All)}
      >
        {Filter.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Filter.Active,
        })}
        onClick={() => setFilter(Filter.Active)}
      >
        {Filter.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Filter.Completed,
        })}
        onClick={() => setFilter(Filter.Completed)}
      >
        {Filter.Completed}
      </a>
    </nav>
  );
};
