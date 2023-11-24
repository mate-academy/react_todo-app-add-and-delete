import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoappFilter } from '../TodoappFilter';

type Props = {
  todos: Todo[],
  filterBy: Filter,
  onFilterChange: (value: Filter) => void;
  handleDelete: (id: number) => Promise<void>;
};

export const TodoappFooter: React.FC<Props> = ({
  todos,
  filterBy,
  onFilterChange,
  handleDelete,
}) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const completedTodosCount = completedTodos.length;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const deleteAllCompleted = async () => {
    const allCompleted = todos.filter(todo => todo.completed);

    await Promise.allSettled(allCompleted.map(todo => (
      handleDelete(todo.id)
    )));
  };

  const showClearCompletedButton = (completedCount: number) => {
    if (completedCount) {
      return (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={deleteAllCompleted}
        >
          Clear completed
        </button>
      );
    }

    return false;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <TodoappFilter
        filterBy={filterBy}
        onFilterClick={onFilterChange}
      />

      {/* don't show this button if there are no completed todos */}
      {showClearCompletedButton(completedTodosCount)}
    </footer>
  );
};
