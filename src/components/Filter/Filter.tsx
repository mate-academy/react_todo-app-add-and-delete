import { useTodoContext } from '../../context/TodosProvider';

interface FilterProps {
  filter: string
}

export const Filter: React.FC<FilterProps> = ({ filter }) => {
  const { filterType, setFilterType } = useTodoContext();

  return (
    <a
      key={filter}
      href="#/"
      className={`filter__link ${filter === filterType ? 'selected' : ''}`}
      data-cy={`FilterLink${filter}`}
      onClick={() => setFilterType(filter)}
    >
      {filter}
    </a>
  );
};
