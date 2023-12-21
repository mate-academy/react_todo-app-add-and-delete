import React from 'react';
import classNames from 'classnames';

import { Status, Todo } from '../types/Todo';
import { Error } from '../types/Error';

const filterButtons = [
  { address: '#/', name: Status.All },
  { address: '#/active', name: Status.Active },
  { address: '#/completed', name: Status.Completed },
];

type Props = {
  todos: Todo[];
  status: Status,
  setStatus: (status: Status) => void;
  setErrorType: (errorType: null | Error) => void;
  onDelete: (todoId: number) => void;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  setErrorType,
  onDelete,
}) => {
  const activeTodos = [...todos].filter(todo => !todo.completed);
  const isCompletedTodo = todos.some(todo => todo.completed);

  const TodoFilterButton = (filter: Status) => {
    setStatus(filter);
    setErrorType(null);
  };

  const handleClearButton = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterButtons.map(({ address, name }) => (
          <a
            key={name}
            href={address}
            className={classNames(
              'filter__link',
              { selected: name === status },
            )}
            data-cy={`FilterLink${name}`}
            onClick={() => TodoFilterButton(name)}
          >
            {name}
          </a>
        ))}
      </nav>

      {isCompletedTodo && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearButton}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
