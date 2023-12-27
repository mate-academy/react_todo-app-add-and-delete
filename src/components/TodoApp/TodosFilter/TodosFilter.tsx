import { useState } from 'react';
import classNames from 'classnames';
import { filters } from './data/filters';
import { getHash } from '../../../libs/helpers';
import { Status } from '../../../libs/enums';

export const TodosFilter = () => {
  const [selectedHash, setSelectedHash] = useState(() => getHash());

  const handleSelectFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { hash } = event.target as HTMLAnchorElement;

    setSelectedHash(hash as Status);
  };

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(({ title, hash, dataCy }) => (
        <a
          key={hash}
          href={hash}
          className={classNames('filter__link', {
            selected: hash === selectedHash,
          })}
          data-cy={dataCy}
          onClick={handleSelectFilter}
        >
          {title}
        </a>
      ))}
    </nav>
  );
};
