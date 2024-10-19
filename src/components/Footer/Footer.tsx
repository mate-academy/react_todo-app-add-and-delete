import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Error } from '../../types/Error';
import { deleteTodo } from '../../api/todos';

interface Props {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  activeTodos: Todo[];
  completedTodos: Todo[];
  filter: Filter;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
  setFilter: (filter: Filter) => void;
  setDeletingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Footer: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  setFilter,
  filter,
  setTodos,
  setErrorMessage,
  setDeletingTodoIds,
}) => {
  const handleClearCompleted = async () => {
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setDeletingTodoIds(completedTodoIds);

    const deletionPromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    const results = await Promise.all(deletionPromises);

    const successfullyDeletedIds = results
      .filter(result => result.success)
      .map(result => result.id);

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    const hasErrors = results.some(result => !result.success);

    if (hasErrors) {
      setErrorMessage(Error.unableToDelete);
      setTimeout(() => {
        setErrorMessage(Error.none);
      }, 3000);
    }

    setDeletingTodoIds([]);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterOption => (
          <a
            key={filterOption}
            href={`#/${filterOption.toLowerCase()}`}
            onClick={() => setFilter(filterOption)}
            className={cn('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
          >
            {filterOption}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted()}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
