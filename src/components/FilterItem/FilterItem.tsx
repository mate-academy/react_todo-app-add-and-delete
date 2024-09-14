import classNames from 'classnames';
import { Filter } from '../../types/Filter';

interface Props {
  filterTodos: Filter;
  filterItem: Filter;
  setFilterTodos: React.Dispatch<React.SetStateAction<Filter>>;
}

export const FilterItem: React.FC<Props> = ({
  filterTodos,
  filterItem,
  setFilterTodos,
}) => {
  const getHref = (item: Filter) => {
    switch (item) {
      case Filter.ACTIVE:
        return '#/active';
      case Filter.COMPLETED:
        return '#/completed';
      default:
        return '#/';
    }
  };

  return (
    <a
      href={getHref(filterItem)}
      className={classNames('filter__link', {
        selected: filterTodos === filterItem,
      })}
      data-cy={`FilterLink${filterItem}`}
      onClick={() => setFilterTodos(filterItem)}
    >
      {filterItem}
    </a>
  );
};
