import { Todo, TodoStatus } from '../../types/Todo';
import { getFilteredTodos } from '../../utils/getFilteredTodos';
import { FilterTodos } from './FilterTodos';

type FooterProps = {
  todos: Todo[];
  selectedFilter: TodoStatus;
  setSelectedFilter: (value: TodoStatus) => void;
  handleClearCompleted: () => void;
};

export const Footer = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  handleClearCompleted,
}: FooterProps) => {
  const activeTodos = getFilteredTodos({
    todos,
    selectedFilter: TodoStatus.Active,
  });

  const hasCompletedTodos = todos.filter(todo => todo.completed).length > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <FilterTodos
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
