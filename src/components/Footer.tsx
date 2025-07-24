import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import * as todosApi from '../api/todos';
import { FilterType } from '../types/FilterType';

export const FILTERS = [
  {
    label: 'All',
    value: FilterType.All,
    cy: 'FilterLinkAll',
  },
  {
    label: 'Active',
    value: FilterType.Active,
    cy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: FilterType.Completed,
    cy: 'FilterLinkCompleted',
  },
];

type Props = {
  leftItems: number;
  query: FilterType;
  setQuery: React.Dispatch<React.SetStateAction<FilterType>>;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setError: (error: string) => void;
};

export const Footer: React.FC<Props> = ({
  leftItems,
  query,
  setQuery,
  todos,
  setTodos,
  setError,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      todosApi
        .deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    Promise.all(deletePromises).then(results => {
      const failedIds = results
        .filter(result => !result.success)
        .map(result => result.id);

      const updatedTodos = todos.filter(
        todo => !(todo.completed && !failedIds.includes(todo.id)),
      );

      setTodos(updatedTodos);

      if (failedIds.length > 0) {
        setError('Unable to delete a todo');
        setTimeout(() => setError(''), 3000);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ label, value, cy }) => (
          <a
            key={value}
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: query === value,
            })}
            data-cy={cy}
            onClick={event => {
              event.preventDefault();
              setQuery(value);
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={handleClearCompleted}
      >
        {hasCompleted && 'Clear completed'}
      </button>
    </footer>
  );
};
