import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  handleError?: (textError: string) => () => void,
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>,
  isClickClearComleted?: boolean,
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  handleError = () => {},
  setTodos = () => {},
  isClickClearComleted = false,
}) => {
  const [hasLoader, setHasLoader] = useState(false);
  const { title, completed, id } = todo;
  const isLoaderClearComleted = isClickClearComleted && completed;

  useEffect(() => {
    if (todo.id === 0) {
      setHasLoader(true);
    }

    return () => {
      setHasLoader(false);
    };
  }, []);

  const handleRemoveClick = () => {
    setHasLoader(true);

    deleteTodo(id)
      .then(() => setTodos((currentTodos) => {
        return currentTodos.filter(todoItem => todo.id !== todoItem.id);
      }))
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setHasLoader(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleRemoveClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': hasLoader || isLoaderClearComleted },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
