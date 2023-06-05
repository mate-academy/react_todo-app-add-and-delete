import { FilterType } from '../../types/FilterType';
import { Filter } from '../Filter/Filter';

interface FooterProps {
  filter: string,
  setFilter: (filter: FilterType) => void,
  todosLength: number,
  hasCompletedTodos: boolean,
  onDeleteCompleted(): Promise<void>,
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  setFilter,
  todosLength,
  hasCompletedTodos,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLength} items left`}
      </span>

      <Filter
        filter={filter}
        setFilter={setFilter}
      />

      <button
        type="button"
        className={`todoapp__clear-completed ${hasCompletedTodos ? 'visible' : 'hidden'}`}
        onClick={() => onDeleteCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
