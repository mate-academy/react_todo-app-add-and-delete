import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import {
  DeletingTodosIdsContext,
  ErrorContext,
  TodosContext,
} from '../providers/TodosProvider';
import { FocusContext } from '../providers/FocusProvider';
import { deleteTodoItem } from '../utils/deleteTodoItem';

type Props = {
  status: Status;
  onStatusChange: (status: Status) => void;
};

export const TodoAppFooter: React.FC<Props> = ({ status, onStatusChange }) => {
  const { todos, setTodos } = useContext(TodosContext);
  const { setErrorMessage } = useContext(ErrorContext);
  const { setDeletingTodosIds } = useContext(DeletingTodosIdsContext);
  const { setFocus } = useContext(FocusContext);

  const remainingTodos = todos.filter((todo) => !todo.completed).length;
  const canClearCompleted = todos.some((todo) => todo.completed);

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter((todo) => todo.completed);

    setDeletingTodosIds((prevDeletingIds) => [
      ...prevDeletingIds,
      ...completedTodos.map((todo) => todo.id),
    ]);

    const deletePromises = completedTodos.map((todo) => {
      return deleteTodoItem({
        todoId: todo.id,
        setTodos,
        setErrorMessage,
        setDeletingTodosIds,
        setFocus,
      });
    });

    Promise.all(deletePromises);
  }, [
    todos,
    setTodos,
    setErrorMessage,
    setDeletingTodosIds,
    setFocus,
  ]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${remainingTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(Status).map(([statusName, value]) => (
          <a
            key={statusName}
            href={value}
            className={classNames(
              'filter__link',
              { selected: status === value },
            )}
            data-cy={`FilterLink${statusName}`}
            onClick={() => onStatusChange(value)}
          >
            {statusName}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!canClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
