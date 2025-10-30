import React, { useContext, useState } from 'react';
import { TodosContext } from '../contexts/TodoContext';
import { useNotification } from '../contexts/NotificationContext';
import { ACTIONS } from '../model/actions';
import { ErrorType, Filter, FILTER, FILTER_LINKS } from '../model/types';
import { FilterLink } from '../ui/FilterLink';
import { useFocus } from '../contexts/FocusContext';

export const TodoFilters: React.FC = () => {
  const { state, dispatch, handleDeleteTodo } = useContext(TodosContext);
  const { showNotification } = useNotification();
  const { todos, tempTodo } = state;
  const [currentFilter, setCurrentFilter] = useState<Filter>(FILTER.ALL);
  const [isDeleting, setIsDeleting] = useState(false);
  const { focusInput } = useFocus();

  const todosLeft = todos.filter(todo => !todo.completed).length;

  const handleFilterChange = (filter: Filter) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: filter });
    setCurrentFilter(filter);
  };

  const handleClearAll = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsDeleting(true);

    const results = await Promise.all(
      completedTodos.map(todo => handleDeleteTodo(todo.id)),
    );

    if (results.some(r => r === false)) {
      showNotification(ErrorType.DELETE_TODO);
    }

    setIsDeleting(false);

    setTimeout(() => {
      focusInput();
    }, 0);
  };

  return (
    <>
      {(todos.length > 0 || tempTodo) && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todosLeft} {todosLeft === 1 ? 'item' : 'items'} left
          </span>

          <nav className="filter" data-cy="Filter">
            {FILTER_LINKS.map(([filter, label]) => (
              <FilterLink
                key={filter}
                filter={filter}
                currentFilter={currentFilter}
                setFilter={handleFilterChange}
                label={label}
                dataCy={`FilterLink${label}`}
              />
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={!isDeleting ? handleClearAll : undefined}
            disabled={todos.every(todo => !todo.completed)}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
