import React, { useContext, useMemo } from 'react';
import { TodoFilter } from './TodoFilter';
import { TodoContext } from '../context/TodoContext';
import { Error } from '../types/ErrorMessage';
import * as TodoService from '../api/todos';

export const Footer: React.FC = () => {
  const { todos, deleteTodo, handleSetErrorMessage, handleSetUpdatingIds } =
    useContext(TodoContext);

  const completedIds: number[] = useMemo(
    () => todos.filter(({ completed }) => completed).map(({ id }) => id),
    [todos],
  );
  const hasActive = useMemo(
    () =>
      todos.filter(({ completed }) => {
        return !completed;
      }).length,
    [todos],
  );

  const handleDeleteCompletedTodos = () => {
    handleSetErrorMessage(Error.none);

    completedIds.forEach(id => {
      handleSetUpdatingIds(id);

      TodoService.deleteTodo(id)
        .then(() => deleteTodo(id))
        .catch(() => handleSetErrorMessage(Error.deleteTodo))
        .finally(() => handleSetUpdatingIds(null));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${hasActive} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedIds.length}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
