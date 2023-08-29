import classNames from 'classnames';
import { Filter } from '../../../types/Filter';
import { useTodo } from '../../../api/useTodo';

const FILTER_MODE = [Filter.all, Filter.active, Filter.completed];

export const TodoFilter: React.FC = () => {
  const { filter, setFilter } = useTodo();

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <ul className="filter">
      {FILTER_MODE.map(currentFilter => {
        const textFilter = capitalizeFirstLetter(currentFilter);

        return (
          <li>
            <a
              href={`#${currentFilter === Filter.all ? '/' : `/${currentFilter}`}`}
              onClick={() => setFilter(Filter[currentFilter])}
              className={classNames('filter__link', {
                selected: (filter === Filter[currentFilter]),
              })}
            >
              {textFilter}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
