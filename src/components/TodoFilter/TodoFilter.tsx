import {FC, useContext, useMemo, useState} from 'react';
import classNames from 'classnames/bind';
import {deleteTodo, getTodos, getTodosByStatus} from '../../api/todos';
import {USER_ID} from '../../react-app-env';
import {AppTodoContext} from '../AppTodoContext/AppTodoContext';
import {ErrorType} from '../Error/Error.types';

enum FilterType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

const Filters = {
  [FilterType.All]: getTodos(USER_ID),
  [FilterType.Active]: getTodosByStatus(USER_ID, false),
  [FilterType.Completed]: getTodosByStatus(USER_ID, true),
};

export const TodoFilter: FC = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setDeletingTodoIDs,
  } = useContext(AppTodoContext);
  const [currentFilter, setCurrentFilter] = useState<FilterType>(
    FilterType.All,
  );

  const completedTodos = useMemo(() => {
    return todos.filter(({ completed }) => completed);
  }, todos);

  const handleClearCompleted = () => {
    setDeletingTodoIDs(
      completedTodos.map(todo => todo.id),
    );

    completedTodos.forEach(async (todo) => {
      try {
        await deleteTodo(todo.id);
      } catch {
        setErrorMessage(ErrorType.DeleteTodoError);
      }
    });

    setDeletingTodoIDs([]);
  };

  const handleFiltration = async (criteria: FilterType) => {
    if (currentFilter === criteria) {
      return;
    }

    setErrorMessage(ErrorType.NoError);

    try {
      setTodos(await Filters[criteria]);
      setCurrentFilter(criteria);
    } catch {
      setErrorMessage(ErrorType.GetAllTodosError);
    }
  };

  return (
    <>
      <nav className="filter">
        {Object.values(FilterType).map(filter => (
          <button
            type="button"
            aria-label="filter button"
            key={filter as string}
            className={classNames(
              'filter__link',
              { selected: currentFilter === filter },
            )}
            onClick={() => handleFiltration(filter)}
          >
            {[filter]}
          </button>
        ))}
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </>
  );
};
