import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { TodoContext } from '../TodoContext';
import { Status } from '../types/Status';
import { removeTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

export const TodosFilter: React.FC = () => {
  const {
    todos,
    setVisibleTodos,
    setTodos,
    setIsClearCompleted,
    setError,
  } = useContext(TodoContext);

  const hasCompletedTodo = todos.some(todo => todo.completed);

  const [selectedFilter, setSelectedFilter] = useState(Status.All);

  const handleFilterTodo = (typeFilter: Status) => {
    switch (typeFilter) {
      case Status.Active:
        return () => {
          setVisibleTodos(todos.filter(todo => todo.completed !== true));
          setSelectedFilter(typeFilter);
        };

      case Status.Completed:
        return () => {
          setVisibleTodos(todos.filter(todo => todo.completed));
          setSelectedFilter(typeFilter);
        };

      case Status.All:
      default:
        return () => {
          setVisibleTodos(todos);
          setSelectedFilter(typeFilter);
        };
    }
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).map(
      todo => removeTodo(todo.id).then(() => {
        setVisibleTodos([...todos.filter(t => !t.completed)]);
        setTodos([...todos.filter(t => !t.completed)]);
      })
        .catch(() => setError(ErrorMessage.DeleteTodo))
        .finally(() => setIsClearCompleted(false)),
    );

    setIsClearCompleted(true);
  };

  const unCompletedCount = todos.filter(
    todo => todo.completed === false,
  ).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(
            'filter__link', { selected: selectedFilter === Status.All },
          )}
          data-cy="FilterLinkAll"
          onClick={handleFilterTodo(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link', { selected: selectedFilter === Status.Active },
          )}
          data-cy="FilterLinkActive"
          onClick={handleFilterTodo(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link', { selected: selectedFilter === Status.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterTodo(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompletedTodo && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
