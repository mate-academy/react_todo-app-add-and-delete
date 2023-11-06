import { FilterType } from '../../types/FilterType';
import { TodoFilter } from './TodoFilter';

type Props = {
  todosQty: number,
  filterTodo: (value: FilterType) => void,
  selectedTodoFilter: FilterType,
};

export const Footer: React.FC<Props> = ({
  todosQty,
  filterTodo,
  selectedTodoFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosQty} items left`}
      </span>
      {/* Hide the footer if there are no todos */}

      {/* Active filter should have a 'selected' class */}
      <TodoFilter
        filterTodo={filterTodo}
        selectedTodoFilter={selectedTodoFilter}
      />
      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};