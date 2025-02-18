import { useContext, useState } from 'react';
import { TodosContext } from '../../Context/TodoContext';
import classNames from 'classnames';
import { ACTIONS } from '../../types/Actions';
import { FilterType, FILTERS } from '../../types/Filters';
import { useNotification } from '../../Context/NotificationContext';

export const TodoFilters = () => {
  const { state, dispatch, handleDeleteTodo } = useContext(TodosContext);
  const { showNotification } = useNotification();
  const { todos, tempTodo } = state;
  const [currentFilter, setcurrentFilter] = useState<FilterType>(FILTERS.ALL);
  const [isDeleting, setIsDeleting] = useState(false);

  const todosLeft = todos.filter(todo => !todo.completed).length;

  const handleFilterChange = (type: FilterType) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: `${type}` });
    setcurrentFilter(type);
  };

  const handleClearAll = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsDeleting(true);

    const deletePromises = completedTodos.map(async todo => {
      try {
        await handleDeleteTodo(todo.id);

        return { success: true, id: todo.id };
      } catch (error) {
        showNotification(`Unable to delete a todo`);

        return { success: false, id: todo.id };
      }
    });

    await Promise.allSettled(deletePromises);
    setIsDeleting(false);
  };

  const getFilterClass = (filter: FilterType) =>
    classNames('filter__link', { selected: currentFilter === filter });

  return (
    <>
      {(todos.length !== 0 || tempTodo) && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todosLeft} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={getFilterClass(FILTERS.ALL)}
              data-cy="FilterLinkAll"
              onClick={() => handleFilterChange(FILTERS.ALL)}
            >
              All
            </a>

            <a
              href="#/active"
              className={getFilterClass(FILTERS.ACTIVE)}
              data-cy="FilterLinkActive"
              onClick={() => handleFilterChange(FILTERS.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={getFilterClass(FILTERS.COMPLETED)}
              data-cy="FilterLinkCompleted"
              onClick={() => handleFilterChange(FILTERS.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          <button
            disabled={todosLeft === todos.length}
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={isDeleting ? undefined : handleClearAll}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
