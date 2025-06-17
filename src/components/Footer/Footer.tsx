import { FilterOptions } from '../../types/enums/Enums';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../TodoFilter/TodoFilter';

interface TodoFooterProps {
  activeTodos: Todo[];
  completedTodos: Todo[];
  filterSelected: FilterOptions;
  setFilterSelected: (filterSelected: FilterOptions) => void;
  handleClearCompleted: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodos,
  completedTodos,
  filterSelected,
  setFilterSelected,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <TodoFilter
        filterSelected={filterSelected}
        setFilterSelected={setFilterSelected}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
