import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { useTodosContext } from './useTodosContext';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    query,
    setQuery,
    setLoadingTodosIds,
    handleError,
    setIsInputFocused,
  } = useTodosContext();
  const completedIds = useMemo(() => {
    return todos.filter(item => item.completed === true).map(item => item.id);
  }, [todos]);
  const notCompletedQuantity = useMemo(() => {
    return todos.filter((todo: Todo) => !todo.completed).length;
  }, [todos]);

  const handleDeleteTodo = (todoId: number): void => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(item => item.id !== todoId),
        );
        setLoadingTodosIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      })
      .catch(() => {
        handleError('Unable to delete a todo');
        setLoadingTodosIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleDeleteCompletedTodos = () => {
    setLoadingTodosIds(currentIds => [...currentIds, ...completedIds]);
    const deletePromises = completedIds.map(id => handleDeleteTodo(id));

    Promise.all(deletePromises)
      .then(() => setIsInputFocused(true))
      .catch(() => handleError('Unable to delete a todo'));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedQuantity} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            href={`#/${status.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: query === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setQuery(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedIds.length === 0}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
