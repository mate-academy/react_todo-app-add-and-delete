import React, { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setTodos: (a: Todo[]) => void;
  allTodos: Todo[];
};

export const TodosFilter: React.FC<Props> = ({ todos, setTodos, allTodos }) => {
  enum Status {
    ALL = 'all',
    ACTIVE = 'active',
    COMPLETED = 'Completed',
  }

  const [filterBy, setFilterBy] = useState<Status>(Status.ALL);

  const getFilteredTodos = async (filter: Status) => {
    let filteredTodos: Todo[] = [];

    switch (filter) {
      case Status.ALL:
        filteredTodos = allTodos;
        break;
      case Status.ACTIVE:
        filteredTodos = allTodos.filter(todo => !todo.completed);
        break;
      case Status.COMPLETED:
        filteredTodos = allTodos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    setTodos(filteredTodos);
  };

  const handleSetFilteredTodos
    = (filter: Status) => {
      setFilterBy(filter);
      getFilteredTodos(filter);
    };

  const completedTodoLength
    = todos.filter(todo => todo.completed).length;

  const uncompletedTodos
    = todos.filter(todo => !todo.completed).length;

  const todoLength = todos.length;

  return (
    (todoLength > 0) ? (
      <>
        <span className="todo-count">
          {`${uncompletedTodos} items left`}
        </span>
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: (filterBy === Status.ALL),
          })}
          onClick={() => handleSetFilteredTodos(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/completed"
          className="filter__link"
          onClick={() => handleSetFilteredTodos(Status.COMPLETED)}
        >
          Completed
        </a>

        <a
          href="#/active"
          className="filter__link"
          onClick={() => handleSetFilteredTodos(Status.ACTIVE)}
        >
          Active
        </a>

        {
          completedTodoLength && (
            <button
              type="button"
              className="clear-completed"
            >
              Clear completed
            </button>
          )
        }
      </>
    ) : null
  );
};
