import { MainitemType } from '../../types/MainitemType';
import classNames from 'classnames';

export const MainItem = ({
  shownTodos,
  onUpdate,
  editFieldVal,
  onEditFieldVal,
  editInputVal,
  onEditInputVal,
  onEditHandle,
  onDelete,
  loadId,
  onLoadId,
  inputMainFocus,
}: MainitemType) => {
  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await onEditHandle(shownTodos);
    }

    if (e.key === 'Escape') {
      onEditFieldVal(null);
    }
  };

  const deleteTodoFromList = async () => {
    onLoadId(shownTodos.id);
    try {
      await onDelete(shownTodos.id);
    } catch {
      // eslint-disable-next-line no-console
      console.error('Error delete');
    } finally {
      onLoadId(null);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: shownTodos.completed,
          active: !shownTodos.completed,
        })}
        key={shownTodos.id}
      >
        {/* eslint-disable jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={shownTodos.completed}
            onChange={() =>
              onUpdate({ ...shownTodos, completed: !shownTodos.completed })
            }
          />
        </label>
        {editFieldVal === shownTodos.id && (
          <input
            data-cy="TodoTitleField"
            ref={inputMainFocus}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editInputVal}
            onChange={e => {
              onEditInputVal(e.target.value);
            }}
            onBlur={async () => {
              await onEditHandle(shownTodos);
            }}
            onKeyUp={async e => {
              await handleKeyUp(e);
            }}
          />
        )}
        {editFieldVal !== shownTodos.id && (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              onEditFieldVal(shownTodos.id);
              onEditInputVal(shownTodos.title);
            }}
          >
            {shownTodos.title}
          </span>
        )}

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={async () => {
            await deleteTodoFromList();
          }}
        >
          ×
        </button>
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': loadId === shownTodos.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
