import classNames from 'classnames';
import { Status } from '../../types/Status';
import { Dispatch, FC } from 'react';

type Props = {
  title: string;
  setActiveFilter: Dispatch<React.SetStateAction<Status>>;
  activeFilter: Status;
  activeOptions: Status;
};

export const FilterButtons: FC<Props> = ({
  title,
  activeFilter,
  setActiveFilter,
  activeOptions,
}) => {
  return (
    <a
      href="#/"
      data-cy={`FilterLink${title}`}
      className={classNames('filter__link', {
        selected: title === activeFilter,
      })}
      onClick={() => setActiveFilter(activeOptions)}
    >
      {title}
    </a>
  );
};
