import classNames from 'classnames';
import { Filters, Filter } from '../types/Filters';

type Props = {
  filters: Filter[],
  filterBy: Filters,
  onFilterBy: (value: Filters) => void;
};

export const TodosFilter: React.FC<Props> = ({
  filters,
  filterBy,
  onFilterBy,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(({ href, title }) => {
        return (
          <a
            key={href}
            href={`#${href}`}
            className={classNames('filter__link', {
              selected: filterBy === title,
            })}
            data-cy={`FilterLink${title}`}
            onClick={() => onFilterBy(title)}
          >
            {title}
          </a>
        );
      })}
    </nav>
  );
};
