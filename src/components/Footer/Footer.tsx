import React, { useState } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filter: Filter;
  filterChange: (filter: Filter) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  clearCompletedTodos: () => Promise<number | undefined>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  filterChange,
  setTodos = () => {},
  clearCompletedTodos = async () => {},
  setError,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const leftTodos = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = async () => {
    try {
      setIsClearCompleted(true);
      const deletedTodoIds = await clearCompletedTodos();

      if (deletedTodoIds && deletedTodoIds.length > 0) {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter((todo) => !deletedTodoIds.includes(todo.id))
        );
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
          className={cn('filter__link', { selected: filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => filterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === Filter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => filterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {!!completedTodos.length && (
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
