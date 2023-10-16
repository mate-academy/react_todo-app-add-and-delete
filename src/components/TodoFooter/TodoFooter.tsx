/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import cn from 'classnames';
import * as todosAPI from '../../api/todos';
import { useTodosState } from '../../contexts/TodosContext';
import { TodoStatus } from '../../types/TodoStatus';
import { useErrorsState } from '../../contexts/ErrorsContext';

type Props = {
  setIsFilterBy: (filterBy: TodoStatus) => void;
};

export const TodoFooter: React.FC<Props> = ({ setIsFilterBy }) => {
  const [todos, todosDispatch] = useTodosState();
  const [, setErrorMessage] = useErrorsState();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasSomeCompletedTodos = todos.some(todo => todo.completed);

  const handleFilterClick = (status: TodoStatus) => {
    setSelectedFilter(status);
    setIsFilterBy(status);
  };

  const handleClearAllCompleted = () => {
    const deletionPromises: Promise<any>[] = [];
    const deletedTodoIds: number[] = [];

    todos.forEach(todo => {
      if (todo.completed) {
        deletionPromises.push(
          new Promise((resolve, reject) => {
            todosAPI.deleteTodo(todo.id)
              .then(() => resolve(todo.id))
              .catch(reject);
          }),
        );
      }
    });

    Promise.allSettled(deletionPromises)
      .then(results => {
        results.forEach(res => {
          if (res.status === 'fulfilled') {
            deletedTodoIds.push(res.value);
          } else {
            setErrorMessage('Unable to delete a todo');
          }
        });
      })
      .finally(() => todosDispatch(
        { type: 'clear all completed', payload: deletedTodoIds },
      ));
  };

  const matchStatusHref = (status: TodoStatus): string => {
    switch (status) {
      case TodoStatus.Active:
        return '#/active';
      case TodoStatus.Completed:
        return '#/completed';
      case TodoStatus.All:
      default:
        return '#/';
    }
  };

  const matchDataCy = (status: TodoStatus): string => {
    switch (status) {
      case TodoStatus.Active:
        return 'FilterLinkActive';
      case TodoStatus.Completed:
        return 'FilterLinkCompleted';
      case TodoStatus.All:
      default:
        return 'FilterLinkAll';
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatus).map(status => (
          <a
            key={status}
            href={matchStatusHref(status)}
            className={cn('filter__link', {
              selected: selectedFilter === status,
            })}
            data-cy={matchDataCy(status)}
            onClick={() => handleFilterClick(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasSomeCompletedTodos}
        onClick={handleClearAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
