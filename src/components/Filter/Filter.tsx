import React from 'react';
import CN from 'classnames';
import { Options } from '../../types/Options';

type Props = {
  onFilterChange: (value: Options) => void;
  option: Options;
};

export const Filter: React.FC<Props> = ({
  onFilterChange,
  option,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={CN(
          'filter__link',
          { selected: option === Options.ALL },
        )}
        onClick={() => onFilterChange(Options.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={CN(
          'filter__link',
          { selected: option === Options.ACTIVE },
        )}
        onClick={() => onFilterChange(Options.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={CN(
          'filter__link',
          { selected: option === Options.ALL },
        )}
        onClick={() => onFilterChange(Options.COMLETED)}

      >
        Completed
      </a>
    </nav>
  );
};
