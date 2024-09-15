import React, { useContext } from 'react';
import { TodoFilter } from '../TodoFilter';
import { ErrorMessage } from '../../types/ErrorMessages';
import { TodoContext } from '../../context';
import * as TodoClient from '../../api/todos';

type Props = {
  activeTodosCount: number;
  completedTodosIds: number[];
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosIds,
}) => {
  const { handleSetErrorMessage, handleUpdatingTodosIds, deleteTodo } =
    useContext(TodoContext);

  const handleDeleteCompletedTodos = () => {
    handleSetErrorMessage(ErrorMessage.None);

    completedTodosIds.forEach(id => {
      handleUpdatingTodosIds(id);

      TodoClient.deleteTodo(id)
        .then(() => deleteTodo(id))
        .catch(() => handleSetErrorMessage(ErrorMessage.Delete))
        .finally(() => handleUpdatingTodosIds(null));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>
      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosIds.length}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
