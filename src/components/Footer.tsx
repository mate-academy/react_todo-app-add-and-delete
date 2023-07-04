import { deleteTodo } from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[],
  filter: Filter,
  handleFilter: (filter: Filter) => void,
  handleError: (error: string) => void,
  handleIsUpdating: (status: boolean) => void,
  handleUpdatingIds: (ids: number[]) => void,
}

export const Footer = ({
  todos, filter, handleFilter, handleError, handleIsUpdating, handleUpdatingIds,
}: FooterProps) => {
  const hasCompleted = todos.some(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed).length;

  const handleCleaner = () => {
    handleUpdatingIds([]);
    handleIsUpdating(false);
  };

  const handleDeleteCompleted = () => {
    handleIsUpdating(true);
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    handleUpdatingIds(completedIds);

    completedIds.map(id => deleteTodo(id)
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => {
        if (id === completedIds[completedIds.length - 1]) {
          handleCleaner();
        }
      }));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
          onClick={() => handleFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
          onClick={() => handleFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
          onClick={() => handleFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handleDeleteCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
