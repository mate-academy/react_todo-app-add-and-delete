/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { TodoLoader } from './TodoLoader';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';
import React from 'react';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { selectedTodo } = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    } else if (editInputRef.current) {
      editInputRef.current.blur();
    }
  }, [isEditing]);

  //#region handlers
  const handleOnDoubleClick = () => {
    setIsEditing(true);
    dispatch({ type: 'selectTodo', payload: todo.id });
  };

  const handleOnClick = () => {
    dispatch({ type: 'startUpdate' });
    dispatch({ type: 'selectTodo', payload: todo.id });
    deleteTodo(todo.id)
      .then(() => {
        dispatch({ type: 'deleteTodo', payload: todo.id });
      })
      .catch(() => {
        dispatch({
          type: 'showError',
          payload: 'Unable to delete a todo',
        });
      })
      .finally(() => dispatch({ type: 'stopUpdate' }));
  };

  const handleOnCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'startUpdate' });
    dispatch({ type: 'selectTodo', payload: todo.id });

    updateTodo(todo.id, { ...todo, completed: e.target.checked })
      .then(newTodo => {
        dispatch({
          type: 'updateTodo',
          payload: { ...newTodo },
        });
      })
      .catch(() => {
        dispatch({ type: 'showError', payload: 'Unable to update a todo' });
      })
      .finally(() => {
        dispatch({ type: 'stopUpdate' });
      });
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'startUpdate' });
    dispatch({ type: 'selectTodo', payload: todo.id });
    if (updatedTitle.trim() === todo.title) {
      setIsEditing(false);
    }

    if (updatedTitle.trim().length === 0) {
      deleteTodo(todo.id)
        .then(() => {
          setIsEditing(false);
          dispatch({ type: 'deleteTodo', payload: todo.id });
        })
        .catch(() =>
          dispatch({ type: 'showError', payload: 'Unable to update a todo' }),
        )
        .finally(() => dispatch({ type: 'stopUpdate' }));
    }

    updateTodo(todo.id, { ...todo, title: updatedTitle.trim() })
      .then(newTodo => {
        dispatch({
          type: 'updateTodo',
          payload: { ...newTodo },
        });

        setIsEditing(false);
      })
      .catch(() => {
        dispatch({ type: 'showError', payload: 'Unable to delete a todo' });
        setIsEditing(true);
      })
      .finally(() => {
        dispatch({ type: 'stopUpdate' });
      });
  };

  const handleOnTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(e.target.value);
  };

  const handleOnInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(e.target.value);
    dispatch({ type: 'startUpdate' });
    dispatch({ type: 'selectTodo', payload: todo.id });

    if (updatedTitle.trim() === todo.title) {
      setIsEditing(false);
      dispatch({ type: 'stopUpdate' });

      return;
    }

    if (updatedTitle.trim().length === 0) {
      deleteTodo(todo.id)
        .then(() => {
          setIsEditing(false);
          dispatch({ type: 'deleteTodo', payload: todo.id });
        })
        .catch(() =>
          dispatch({ type: 'showError', payload: 'Unable to delete a todo' }),
        )
        .finally(() => dispatch({ type: 'stopUpdate' }));

      return;
    }

    updateTodo(todo.id, { ...todo, title: updatedTitle.trim() })
      .then(newTodo => {
        dispatch({
          type: 'updateTodo',
          payload: { ...newTodo },
        });

        setIsEditing(false);
      })
      .catch(() => {
        dispatch({ type: 'showError', payload: 'Unable to update a todo' });
        setIsEditing(true);
      })
      .finally(() => {
        dispatch({ type: 'stopUpdate' });
      });
  };

  const handleEscKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setUpdatedTitle(todo.title);
      setIsEditing(false);
    }
  };

  //#endregion
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { ['completed']: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleOnCheckChange}
        />
      </label>

      {isEditing && selectedTodo === todo.id ? (
        <form onSubmit={handleOnSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={handleOnTextChange}
            ref={editInputRef}
            onBlur={handleOnInputBlur}
            onKeyDown={handleEscKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleOnDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleOnClick}
          >
            ×
          </button>
        </>
      )}
      <TodoLoader todo={todo} />
    </div>
  );
};
