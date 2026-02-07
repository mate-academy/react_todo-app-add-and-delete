import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import classNames from 'classnames';

type Props = {
  title: string;
  completed: boolean;
  isLoading?: boolean;
  deletedId?: number[];
  id?: number;
  handleDelete?: () => void;
};

export const TodoItem: React.FC<Props> = ({
  title,
  completed,
  isLoading = false,
  deletedId,
  handleDelete,
  id,
}) => {
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [newTitleTodo, setNewTitleTdo] = useState('');
  const refEditInput = useRef<HTMLInputElement | null>(null);

  const showEditForm = () => {
    setIsDoubleClick(true);
  };

  useEffect(() => {
    setNewTitleTdo(title);
  }, [title]);

  useEffect(() => {
    refEditInput.current?.focus();
  }, [isDoubleClick]);

  const closeEditForm = () => setIsDoubleClick(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <Label className="todo__status-label">
        <Input
          type="checkbox"
          className="todo__status"
          dataCy="TodoStatus"
          checked={completed}
        />
      </Label>

      {!isDoubleClick && (
        <span
          onDoubleClick={showEditForm}
          data-cy="TodoTitle"
          className="todo__title"
        >
          {title}
        </span>
      )}
      {!isDoubleClick && (
        <Button
          type="button"
          className="todo__remove"
          dataCy="TodoDelete"
          onClick={handleDelete}
          content="×"
        />
      )}

      {isDoubleClick && (
        <form>
          <Input
            dataCy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onBlur={closeEditForm}
            title={newTitleTodo}
            onChange={e => setNewTitleTdo(e.target.value)}
            ref={refEditInput}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading || (id !== undefined && deletedId?.includes(id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
