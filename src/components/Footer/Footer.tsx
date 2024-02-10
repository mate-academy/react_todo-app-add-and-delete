import { useContext } from 'react';
import { TodoFilter } from '../TodoFilter';
import { TodoContext } from '../../context/TodoContext';
import { ErrorMessage } from '../../types/ErrorMessage';
import * as TodoClient from '../../api/todos';

type Props = {
  activeTodosCount: number,
  completedTodosIds: number[],
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosIds,
}) => {
  const {
    deleteTodo,
    handleSetErrorMessage,
    handleUpdatingTodosIds,
  } = useContext(TodoContext);

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
