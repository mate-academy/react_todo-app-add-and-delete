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

  const { activeTodos: activeTodosAmount } = todos.reduce(
    (acc, todo) => {
      if (todo.completed) {
        // eslint-disable-next-line no-param-reassign
        acc.completedTodos += 1;
      } else {
        // eslint-disable-next-line no-param-reassign
        acc.activeTodos += 1;
      }

      return acc;
    },
    { activeTodos: 0, completedTodos: 0 },
  );

  const setFilter = (newFilterField: FilterField) => {
    if (filterField !== newFilterField) {
      setFilterField(newFilterField);
    }
  };

  const deleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(({ id }) =>
      deleteTodo(id).then(() => {
        deleteTodoLocal(id);
      }),
    );

    Promise.all(deletePromises)
      .then(() => {
        inputRef.current?.focus();
      })
      .catch(() => {
        setTimeoutErrorMessage('Unable to delete a todo');
      });
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
