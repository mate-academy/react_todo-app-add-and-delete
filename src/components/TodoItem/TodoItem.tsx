/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number | Pick<Todo, 'id'>) => Promise<void>;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete = () => Promise.resolve(),
}) => {
  const { id, title, completed } = todo;
  const [editable, setEditable] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [editableTodoTitleValue, setEditableTodoTitleValue] =
    useState<string>(title);

  useEffect(() => {
    setVisible(true);

    return () => {};
  }, []);

  const handleEditTodoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditableTodoTitleValue(event.target.value);
  };

  const handleEditTodoFormSubmit = (
    event: // eslint-disable-next-line prettier/prettier
    | React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement>,
  ) => {
    if ('preventDefault' in event) {
      event.preventDefault();
    }

    setLoading(true);

    //TODO: handle todo title change
    setTimeout(() => setLoading(false), 300);
    setEditable(false);
  };

  const handleTodoStatusChange = () => {
    setLoading(true);

    //TODO: handle status change
    setTimeout(() => setLoading(false), 300);
  };

  const handleDeleteTodoButtonClick = () => {
    setLoading(true);

    onDelete(id).finally(() => setLoading(false));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
        'item-enter item-enter-active': visible,
        'item-exit item-exit-active': !visible,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoStatusChange}
        />
      </label>

      {editable ? (
        <form onSubmit={handleEditTodoFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={handleEditTodoInputChange}
            onBlur={handleEditTodoFormSubmit}
            value={editableTodoTitleValue}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditable(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodoButtonClick}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
