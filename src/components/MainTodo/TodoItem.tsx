/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useState } from 'react';
import cn from 'classnames';

import { LoaderTodo } from '../Loader/LoaderTodo';
import { Todo } from '../../types/Todo';
import { FormMain } from './TodoItem/FormMain';
import { ButtonMain } from './TodoItem/ButtonMain';

interface IProps {
  todo: Todo;
  loading: boolean;
  checkTodo?: (id: string) => void;
  showError?: (err: string) => void;
  setLoading?: (bool: boolean) => void;
}

export const TodoItem: FC<IProps> = ({
  todo,
  loading,
  checkTodo = () => {},
  showError = () => {},
}) => {
  const [editableTodoId, setEditableTodoId] = useState<string | null>(null);
  const [editableLoad, setEditableLoad] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const { title, completed, id } = todo;
  const isEditable = editableTodoId === id;
  const isLoading = deleteLoadingId === id || editableLoad;

  const handleDoubleClick = () => {
    setEditableTodoId(id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
      title="Change"
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => checkTodo(id)}
          disabled={loading}
        />
      </label>

      {isEditable ? (
        <>
          <FormMain
            id={id}
            title={title}
            editableTodoId={editableTodoId}
            setEditableTodoId={() => setEditableTodoId(null)}
            showError={showError}
            setEditableLoad={setEditableLoad}
          />
        </>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <ButtonMain
            id={id}
            showError={showError}
            loading={loading}
            onDeleteClick={() => setDeleteLoadingId(id)}
          />
        </>
      )}
      <LoaderTodo loading={loading} isLoading={isLoading} />
    </div>
  );
};
