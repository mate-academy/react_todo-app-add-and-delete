/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../context/ContextReducer';

interface Props {
  todo: Todo;
}

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const { currentId, todoLoading, allTodoLoading } = useContext(StateContext);

  const dispatch = useContext(DispatchContext);

  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });

  const handleAddNewTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch({
      type: 'submitNewTitile',
      currentId: todo.id,
      currentTitle: todo.title,
    });
    dispatch({ type: 'setEdit', currentId: 0 });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      dispatch({ type: 'setEdit', currentId: 0 });
    }
  };

  const handleSubmitOnBlur = () => {
    dispatch({
      type: 'submitNewTitile',
      currentId: todo.id,
      currentTitle: todo.title,
    });
    dispatch({ type: 'setEdit', currentId: 0 });
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'setNewTitle',
      value: event.target.value,
      currentId: todo.id,
    });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          onChange={() =>
            dispatch({
              type: 'setComplate',
              currentId: todo.id,
              currentComplate: todo.completed,
            })
          }
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {currentId !== todo.id && (
        <>
          <span
            onDoubleClick={() =>
              dispatch({ type: 'setEdit', currentId: todo.id })
            }
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            onClick={() => dispatch({ type: 'deleteTodo', currentId: todo.id })}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todoLoading[todo.id] || allTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {currentId === todo.id && (
        <>
          <form onSubmit={handleAddNewTitleSubmit}>
            <input
              ref={titleField}
              onKeyUp={handleKeyUp}
              onChange={handleChangeInput}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={todo.title}
              onBlur={handleSubmitOnBlur}
            />
          </form>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': todoLoading[todo.id] || allTodoLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
