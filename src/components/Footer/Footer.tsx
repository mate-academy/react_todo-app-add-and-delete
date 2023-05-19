import { FilterBy } from '../../enums/FilterBy';
import { TodoFilter } from '../TodoFilter';

type Props = {
  filter: FilterBy;
  onChange: (newFilter: FilterBy) => void;
  activeTodosNumber: number;
  onClear: () => void;
  areThereCompleted: boolean;
};

export const Footer: React.FC<Props> = ({
  filter,
  onChange,
  activeTodosNumber,
  onClear,
  areThereCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosNumber} items left`}
      </span>

      <TodoFilter
        filter={filter}
        onChange={onChange}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!areThereCompleted}
        onClick={onClear}
        style={areThereCompleted ? {} : { color: 'white' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
