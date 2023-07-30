import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/Filter';
import { ErrorType } from '../types/Error';
import { deleteOnServer } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: FilterTypes,
  setFilter: (filter: FilterTypes) => void;
  setError: (value: ErrorType) => void;
  setIsLoading: (value: boolean) => void;
  setUpdatingTodos: (value: number[]) => void;
};

export const Filter: React.FC<Props> = ({
  todos,
  setTodos,
  filter,
  setFilter,
  setError,
  setIsLoading,
  setUpdatingTodos,
}) => {
  const amountActiveTodos = todos.filter((todo) => !todo.completed).length;
  const availableCompletedTodos = todos.some((todo) => todo.completed);

  function clearCompletedTodos() {
    const completedTodosId = todos.filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setUpdatingTodos(completedTodosId);
    completedTodosId.forEach((id) => {
      setIsLoading(true);
      deleteOnServer(id).catch(() => setError(ErrorType.Delete))
        .finally(() => {
          setIsLoading(false);
          setTodos(todos.filter((todo) => !todo.completed));
          setUpdatingTodos([]);
        });
    });
  }

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${amountActiveTodos} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterTypes.All,
          })}
          onClick={() => {
            setFilter(FilterTypes.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterTypes.Active,
          })}
          onClick={() => {
            setFilter(FilterTypes.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterTypes.Completed,
          })}
          onClick={() => {
            setFilter(FilterTypes.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed',
          { 'is-invisible': !availableCompletedTodos })}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
