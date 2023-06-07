import { FilterType } from './types/Filters';
import { Todo } from './types/Todo';
import { TodoFilter } from './TodoFilter';

interface TodoFooterProps {
  todos: Todo[],
  filterType: string,
  setFilterType(filterType: FilterType): void,
  foundCompletedTodo: Todo | undefined,
  clearCompleted: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = (
  {
    todos, filterType, setFilterType, foundCompletedTodo, clearCompleted,
  }: TodoFooterProps,
) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <TodoFilter
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {foundCompletedTodo && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
