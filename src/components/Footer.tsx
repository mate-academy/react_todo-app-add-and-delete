import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[];
  filter: Status;
  filterChange: (filter: Status) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  clearCompletedTodos: () => void;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  filterChange,
  setTodos = () => { },
  clearCompletedTodos = () => { },
  setError,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const leftTodos = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = async () => {
    try {
      setIsClearCompleted(true);
      const deletedTodoId = await clearCompletedTodos();

      if (deletedTodoId !== undefined) {
        setTodos((currentTodos: Todo[]) => currentTodos
          .filter((todo) => todo.id === deletedTodoId));
      }
    } catch (error) {
      setError(ErrorType.DeleteError);
    } finally {
      setIsClearCompleted(false);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftTodos === 1 ? (
          '1 item left'
        ) : (
          `${leftTodos} items left`
        )}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === Status.All })}
          data-cy="FilterLinkAll"
          onClick={() => filterChange(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === Status.Active })}
          data-cy="FilterLinkActive"
          onClick={() => filterChange(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterChange(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__clear-completed', {
            'clearing-completed': isClearCompleted,
          })}
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
