import cn from 'classnames';
import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';
import { deleteTodos } from '../api/todos';
import { Errors } from '../types/Errors';

interface Props {
  todosCounter: number,
  filterBy: FilterBy,
  setFilterBy: (value: FilterBy) => void,
  todos: Todo[],
  setTodos:(value: Todo[]) => void,
  setLoading: (value: boolean) => void,
  setErrorMessage: (value: Errors) => void,
}

export const Footer: React.FC<Props> = ({
  todosCounter,
  filterBy,
  setFilterBy,
  todos,
  setTodos,
  setLoading,
  setErrorMessage,
}) => {
  const activeTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    const clearCompleted = todos.filter(todo => todo.completed);

    setLoading(true);

    clearCompleted.forEach(todo => (
      deleteTodos(todo.id)
        .then(() => setTodos(todos.filter(item => !item.completed)))
        .catch(() => setErrorMessage(Errors.UnableDelete))
        .finally(() => setLoading(false))
    ));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(FilterBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(FilterBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.Complited,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(FilterBy.Complited)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {activeTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
