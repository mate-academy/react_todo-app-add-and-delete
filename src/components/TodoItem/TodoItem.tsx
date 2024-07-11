/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';

type Props = {
  todo: Todo;
  deleteTodosFromServer: (a: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, deleteTodosFromServer }) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const { editingId, isSubmitting, deletedTodos } = useGlobalState();
  const dispatch = useDispatch();
  const { id, completed, title } = todo;

  const isEditing = id === editingId;

  const updateTodo = (updatedTodo: Todo) => {
    if (updatedTodo.title) {
      dispatch({ type: Type.UpdateTodo, payload: updatedTodo });
    } else {
      dispatch({ type: Type.DeleteTodo, payload: updatedTodo });
    }
  };

  const handleRemoveButton = (removedTodo: Todo) => {
    deleteTodosFromServer(removedTodo);
    dispatch({ type: Type.setDeletedTodos, payload: removedTodo });
  };

  const updateTodoCheckStatus = (updatedTodo: Todo) => {
    dispatch({ type: Type.UpdateTodoCheckStatus, payload: updatedTodo });
  };

  const handleDoubleClick = (editedTodo: Todo) => {
    dispatch({ type: Type.setEditingId, payload: editedTodo.id });
  };

  const updateTitle = () => {
    const trimmedTitle = newTitle.trim();

    setNewTitle(trimmedTitle);

    updateTodo({ ...todo, title: trimmedTitle });
    dispatch({ type: Type.setEditingId, payload: undefined });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTitle();
  };

  const checkEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEsc = e.key === 'Escape' ? true : false;

    if (isEsc) {
      dispatch({ type: Type.setEditingId, payload: undefined });
      setNewTitle(title);
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTodoCheckStatus({ ...todo, completed: e.target.checked });
  };

  const handleNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const loaderCheck = todo.id === 0 || deletedTodos.includes(todo);

  return (
    <div
      data-cy="Todo"
      className={
        'todo ' +
        (completed ? 'completed' : '') +
        (isSubmitting ? 'is-active' : '')
      }
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheck}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleNewTitle}
            onKeyUp={checkEsc}
            onBlur={updateTitle}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemoveButton(todo)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={'modal overlay ' + (loaderCheck ? 'is-active' : '')}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
