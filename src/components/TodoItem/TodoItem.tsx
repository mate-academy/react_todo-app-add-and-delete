import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { DispatchContex } from '../../Store';
import { deleteTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  isPending: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isPending }) => {
  const { completed, title, id } = todo;
  const [value, setValue] = useState(title);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(isPending);
  const dispatch = useContext(DispatchContex);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPending) {
      setIsLoading(true);
    }
  }, [isPending]);

  const handlerEndEdit = () => {
    if (!value.trim()) {
      dispatch({ type: 'remove-todo', payload: id });
    } else {
      dispatch({
        type: 'set-title',
        payload: { id, title: value.trim() },
      });
      setIsEdit(false);
    }
  };

  const handlerSubmitEdit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    handlerEndEdit();
  };

  const handlerOnKeyUpEsc = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Escape') {
      setValue(todo.title);
      setIsEdit(false);
    }
  };

  const handlerDeleteTodo = () => {
    setIsLoading(true);
    deleteTodo(id)
      .then(res => {
        if (res === 1) {
          dispatch({ type: 'remove-todo', payload: id });
        }
      })
      .catch(() => {
        dispatch({ type: 'set-error', payload: 'Unable to delete a todo' });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (inputRef.current && isEdit) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label" aria-label="todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            dispatch({
              type: 'set-complete',
              payload: { id, completed: !completed },
            });
          }}
        />
      </label>

      {isEdit ? (
        <form onSubmit={handlerSubmitEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={value}
            onChange={evt => setValue(evt.target.value)}
            onBlur={handlerEndEdit}
            onKeyUp={handlerOnKeyUpEsc}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
            autoFocus
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handlerDeleteTodo}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': isLoading,
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
