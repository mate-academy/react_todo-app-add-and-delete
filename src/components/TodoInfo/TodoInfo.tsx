import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';

import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { LoadingTodosContext } from '../LoadingTodosContext';

type Props = {
  todo: Todo;
  showError: (errorMessage: string) => void,
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  showError,
  setAllTodos,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const {
    loadingTodosIds,
    setLoadingTodosIds,
  } = useContext(LoadingTodosContext);

  const isLoadingState = useMemo(() => (
    loadingTodosIds.includes(id)
  ), [loadingTodosIds]);

  const deleteTodoFromServer = async () => {
    try {
      setLoadingTodosIds(prevIds => [...prevIds, id]);

      await deleteTodo(id);

      setAllTodos(prevTodos => prevTodos.filter(prevTodo => (
        prevTodo.id !== id
      )));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingTodosIds(prevIds => prevIds.filter(prevId => prevId !== id));
    }
  };

  window.console.log('rendering toodo info');

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

      <button
        aria-label="Remove"
        type="button"
        className="todo__remove"
        onClick={() => deleteTodoFromServer()}
      >
        ×
      </button>
    </div>
  );
};
