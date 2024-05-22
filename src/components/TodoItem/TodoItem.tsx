import React, { useContext, useEffect, useRef, useState } from 'react';
import { deleteTodo, USER_ID } from '../../api/todos';
import { DispatchContext, StateContext } from '../../store/TodoContext';
import { ActionTypes } from '../../store/types';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(todo?.title);
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);

  const dispatch = useContext(DispatchContext);
  const { isLoading } = useContext(StateContext);
  const onDelete = () => {
    setDeletedTodo(todo);
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    if (USER_ID) {
      deleteTodo(todo.id)
        .then(() => {
          dispatch({
            type: ActionTypes.DELETE_TODO,
            payload: todo.id,
          });
        })
        .catch(() => {
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: 'Unable to delete a todo',
          });
        })
        .finally(() => {
          dispatch({ type: ActionTypes.SET_LOADING, payload: false });
          setDeletedTodo(null);
          dispatch({ type: ActionTypes.SET_REFRESH });
        });
    }
  };

  const onBlur = () => {
    if (title.trim()) {
      dispatch({
        type: ActionTypes.EDIT_TODO,
        payload: { id: todo.id, title: title.trim() },
      });
    } else {
      dispatch({ type: ActionTypes.DELETE_TODO, payload: todo.id });
    }

    setEditMode(false);
  };

  const onSubmit = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onBlur();
    } else if (event.key === 'Escape') {
      setTitle(todo.title);
      setEditMode(false);
    }
  };

  const renameField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renameField.current && editMode) {
      renameField.current.focus();
    }
  }, [editMode]);

  return (
    <div data-cy="Todo" className={todo?.completed ? 'todo completed' : 'todo'}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          onChange={() =>
            dispatch({ type: ActionTypes.TOGGLE_TODO, payload: todo.id })
          }
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
        />
      </label>
      {editMode ? (
        <form onKeyUp={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={onBlur}
            ref={renameField}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setEditMode(true)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo?.title}
          </span>
          <button
            onClick={onDelete}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={`modal overlay ${(todo.id === 0 || (isLoading && deletedTodo?.id === todo.id)) && 'is-active'}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
