import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { useTodos } from '../../context';

type Props = {
  filterItem: (keyof typeof FilterType),
};

export const Filter = ({ filterItem } : Props) => {
  const { filter, setFilter } = useTodos();

  return (
    <>
      <a
        href="#/"
        className={classNames('filter__link',
          { selected: (filter === filterItem) })}
        data-cy={`FilterLink${filterItem}`}
        onClick={() => setFilter(FilterType[filterItem])}
      >
        {filterItem}
      </a>
    </>
  );
};
