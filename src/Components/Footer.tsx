import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  focusInput: () => void | undefined;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
  setProcessingIds,
  setTodos,
  setErrorMessage,
  focusInput,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setProcessingIds(prev => [...prev, todo.id]);
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() => {
          setProcessingIds(prev => prev.filter(id => id !== todo.id));
          focusInput();
        });
    });
  };

  const dataCyByFilter: Record<FilterStatus, string> = {
    [FilterStatus.All]: 'FilterLinkAll',
    [FilterStatus.Active]: 'FilterLinkActive',
    [FilterStatus.Completed]: 'FilterLinkCompleted',
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status}`}
            className={classNames('filter__link', {
              selected: filterStatus === status,
            })}
            data-cy={dataCyByFilter[status]}
            onClick={() => {
              setFilterStatus(status);
              focusInput();
            }}
          >
            {status.slice(0, 1).toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
