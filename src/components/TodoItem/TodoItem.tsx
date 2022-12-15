import classNames from 'classnames';
import React, { useState } from 'react';
import { removeTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  isAdding: boolean
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  onSetTypeError: React.Dispatch<React.SetStateAction<string>>
  toLoad:() => Promise<void>
  isDeletedComplete: boolean
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  onSetIsError,
  onSetTypeError,
  toLoad,
  isDeletedComplete,
}) => {
  const { title, completed } = todo;
  const [isDeleted, setIsdeleted] = useState<boolean>(false);

  const deleteTodo = async (id: number) => {
    try {
      setIsdeleted(true);
      await removeTodo(id);
    } catch (inError) {
      onSetIsError(false);
      onSetTypeError(Errors.ErrDEL);
    }

    toLoad();
    setIsdeleted(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isAdding
            || isDeleted || (isDeletedComplete && todo.completed),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
