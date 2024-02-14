import cn from 'classnames';
import { Status } from '../types/Status';

type Props = {
  filter:string,
  setFilter: React.Dispatch<React.SetStateAction<Status>>
};

export const TodosFilter:React.FC<Props> = ({ filter, setFilter }) => {
  const changeFilterByStatusHandler = (statusVariant:Status) => {
    setFilter(statusVariant);
  };

  const filterVariants = Object.keys(Status) as Array<keyof typeof Status>;

  return (
    <nav className="filter" data-cy="Filter">
      {
        filterVariants.map((key) => {
          const filterBtnClassName = cn('filter__link', {
            selected: filter === Status[key],
          });

          return (
            <a
              key={key}
              href={`./#/${Status[key]}`}
              className={filterBtnClassName}
              data-cy={`FilterLink${key}`}
              onClick={() => changeFilterByStatusHandler(Status[key])}
            >
              {key}
            </a>
          );
        })
      }
    </nav>
  );
};
