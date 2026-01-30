import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  setFilter: (data: string) => void;
};

export const Filter: React.FC<Props> = ({ setFilter }) => {
  const FILTERS = ['all', 'completed', 'active'];
  const [selected, setSelected] = useState('all');

  const nameFormat = (str: string) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const filterHandler = (item: string) => {
    setSelected(item);
    setFilter(item);
  };

  return (
    <nav className="filter" data-cy="Filter">
      {FILTERS.map(item => (
        <a
          href={`#/${item}`}
          className={classNames({
            filter__link: true,
            selected: item === selected,
          })}
          data-cy={`FilterLink${nameFormat(item)}`}
          key={item}
          onClick={event => {
            event.preventDefault();
            filterHandler(item);
          }}
        >
          {nameFormat(item)}
        </a>
      ))}
    </nav>
  );
};
