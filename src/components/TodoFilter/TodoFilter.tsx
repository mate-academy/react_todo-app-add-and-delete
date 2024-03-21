import classNames from 'classnames';
import { Status } from '../../enums/Status';
import { useTodosContext } from '../../hooks/useTodosContext';

export const TodoFilter: React.FC = () => {
  const { filter, setFilter } = useTodosContext();

  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(Status).map(type => {
        const [key, value] = type;

        return (
          <a
            key={key}
            href={filter === Status.All ? '#/' : `#/${filter}`}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${key}`}
            onClick={() => setFilter(value)}
          >
            {key}
          </a>
        );
      })}
    </nav>
  );
};
