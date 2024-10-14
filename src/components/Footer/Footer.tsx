import { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import classNames from 'classnames';
import { deleteTodoItem } from '../../utils/deleteTodoItem';

type FooterType = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setCurrentFilter: (filter: FilterType) => void;
  setError: Dispatch<SetStateAction<string>>;
  setisLoadingId: Dispatch<SetStateAction<number | null>>;
};

export const Footer: React.FC<FooterType> = ({
  todos,
  setTodos,
  setCurrentFilter,
  setError,
  setisLoadingId,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(FilterType.All);

  const completedTodos = todos.filter(todo => todo.completed);
  const TodoCount = todos.length - completedTodos.length;

  const handleFilterChange = (filterType: FilterType) => {
    setActiveFilter(filterType);
    setCurrentFilter(filterType);
  };

  const handleClearComplete = () => {
    const completedTodoIds = completedTodos.map(todo => todo.id);

    Promise.all(
      completedTodoIds.map(id => {
        setisLoadingId(id);

        return deleteTodoItem(id, todos, setTodos, setError, setisLoadingId);
      }),
    ).finally(() => {
      setisLoadingId(null);
    });
  };

  return (
    // {/* Hide the footer if there are no todos */}
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {TodoCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleClearComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
