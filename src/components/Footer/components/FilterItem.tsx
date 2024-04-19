import { useContext } from 'react';
import { todosContext } from '../../../Store';
import classNames from 'classnames';
import { Filter } from '../../../types/Filter';

interface Props {
  value: Filter;
}

export const FilterItem: React.FC<Props> = ({ value }) => {
  const { filter, setFilter } = useContext(todosContext);
  const buttonText = value.charAt(0).toUpperCase() + value.slice(1);
  const isSelected = filter === value;
  const handleFilter = () => {
    setFilter(value);
  };

  return (
    <a
      href={value !== Filter.all ? `#/${value}` : `#/`}
      className={classNames('filter__link', { selected: isSelected })}
      data-cy={`FilterLink${buttonText}`}
      onClick={() => handleFilter()}
    >
      {buttonText}
    </a>
  );
};
