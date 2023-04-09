import React, {
  useCallback,
  useContext,
  useMemo,
} from 'react';
import classNames from 'classnames';

import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppContext';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const {
    allTodos,
    setAllTodos,
    showError,
    setShouldShowError,
    loadingTodosIds,
    setLoadingTodosIds,
  } = useContext(AppContext);

  const isLoadingState = useMemo(() => (
    loadingTodosIds.includes(id)
  ), [loadingTodosIds]);

  const deleteTodoFromServer = useCallback(async () => {
    try {
      setShouldShowError(false);
      setLoadingTodosIds(prevIds => [...prevIds, id]);

      await deleteTodo(id);

      setAllTodos(prevTodos => prevTodos.filter(prevTodo => (
        prevTodo.id !== id
      )));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingTodosIds([0]);
    }
  }, [loadingTodosIds, allTodos]);

  const handleRemoveButtonClick = () => {
    deleteTodoFromServer();
  };

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        aria-label="Remove"
        type="button"
        className="todo__remove"
        onClick={handleRemoveButtonClick}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoadingState },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
