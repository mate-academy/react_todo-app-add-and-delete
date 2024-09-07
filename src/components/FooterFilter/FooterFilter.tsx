import classNames from 'classnames';
import React from 'react';
import { Options } from '../../types/Options';

type Props = {
  selected: Options;
  setSelected: (selected: Options) => void;
};

export const FooterFilter: React.FC<Props> = ({ selected, setSelected }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Options).map(option => (
        <a
          key={option}
          href={`#/${option.toLowerCase()}`}
          className={classNames('filter__link', {
            selected: selected === option,
          })}
          data-cy={`FilterLink${option}`}
          onClick={() => setSelected(option)}
        >
          {option}
        </a>
      ))}
    </nav>
  );
};
