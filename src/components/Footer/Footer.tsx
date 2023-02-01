import { FilterStatus } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter';

type Props = {
  remainingTodos: Todo[],
  completedTodos: Todo[],
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>,
  filterStatus: string,
  onClear: () => void,
};

export const Footer: React.FC<Props> = ({
  remainingTodos,
  completedTodos,
  setFilterStatus,
  filterStatus,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${remainingTodos.length} items left`}
      </span>

      <Filter setFilterStatus={setFilterStatus} filterStatus={filterStatus} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: `${!completedTodos.length ? 'hidden' : 'visible'}` }}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
