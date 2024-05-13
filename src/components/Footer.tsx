import { useCurrentState, useTodosMethods } from '../store/reducer';
import { FilterField } from '../types/FilterField';
import cn from 'classnames';
import { deleteTodo } from '../api/todos';

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Footer: React.FC<Props> = ({ inputRef }) => {
  const { todos, filterField } = useCurrentState();
  const { setFilterField, deleteTodoLocal, setTimeoutErrorMessage } =
    useTodosMethods();

  const activeTodosAmount = todos.reduce(
    (acc, todo) => (todo.completed ? acc : acc + 1),
    0,
  );

  const setFilter = (newFilterField: FilterField) => {
    if (filterField !== newFilterField) {
      setFilterField(newFilterField);
    }
  };

  const deleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    // for each ID in completed todos we try to remove it from server
    // success - removes them from local todos array
    // fail - shows an error, doesn't remove locally
    for (const { id } of completedTodos) {
      deleteTodo(id)
        .then(() => {
          deleteTodoLocal(id);
        })
        .catch(() => {
          setTimeoutErrorMessage('Unable to delete a todo');
        });
    }

    // focuses on input field
    inputRef.current?.focus();
  };

  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosAmount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterField === FilterField.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterField.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterField === FilterField.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterField.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterField === FilterField.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterField.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
