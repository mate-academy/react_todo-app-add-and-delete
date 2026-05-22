import { useState } from 'react';
import { Status } from '../App';

type Props = {
  changeOption: (option: Status) => void;
};

export const FilterOptions = ({ changeOption }: Props) => {
  const [option, setOption] = useState<Status>(Status.All);
  const filters = [Status.All, Status.Active, Status.Completed];

  const handleClick = (filter: Status) => {
    setOption(filter);
    changeOption(filter);
  };

  const getLinkClass = (filter: string) => {
    return option === filter ? 'filter__link selected' : 'filter__link';
  };

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(filter => (
        <a
          key={filter}
          href="#/"
          className={getLinkClass(filter)}
          data-cy={`FilterLink${filter}`}
          onClick={() => handleClick(filter)}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
