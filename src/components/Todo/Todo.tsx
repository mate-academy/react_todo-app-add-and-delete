import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo, removeTodo, editTodo } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todo: Todo;
  getTodo: (userId: number) => void;
  setUpdateError: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoveError: React.Dispatch<React.SetStateAction<boolean>>;
  editTitle: React.RefObject<HTMLInputElement>;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isEditting?: Todo | null;
  setIsEditting?: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  getTodo,
  setUpdateError,
  setRemoveError,
  editTitle,
  setIsHidden,
  isEditting,
  setIsEditting,
}) => {
  const user = useContext(AuthContext);
  const [inputTitle, setInputTitle] = useState('');
  const [isRemoving, setIsRemoving] = useState<Todo | null>(null);
  const [
    tooggleDoubleClick,
    setToggleDoubleClick,
  ] = useState<Todo | null>(null);

  const selectCompleted = async (toDo: Todo) => {
    try {
      await updateTodo(toDo, !todo.completed);
    } catch {
      setUpdateError(true);
      setIsHidden(false);
    }

    if (user) {
      getTodo(user.id);
    }
  };

  const removeTodos = async (toDo: Todo) => {
    removeTodo(toDo);
    try {
      setIsRemoving(toDo);
      await removeTodo(toDo);
    } catch {
      setRemoveError(true);
      setIsHidden(false);
      setIsRemoving(null);
    }

    if (user) {
      getTodo(user.id);
    }
  };

  const editTodos = async (toDo: Todo) => {
    const trimTitle = inputTitle.trim();

    if (trimTitle.length < 1) {
      setToggleDoubleClick(null);
      removeTodo(toDo);

      return;
    }

    if (trimTitle === toDo.title) {
      setToggleDoubleClick(null);

      return;
    }

    try {
      if (setIsEditting) {
        setIsEditting(toDo);
      }

      setToggleDoubleClick(null);
      await editTodo(toDo, trimTitle);
    } catch {
      setUpdateError(true);
      setIsHidden(false);
    }

    if (user) {
      getTodo(user.id);
    }

    setToggleDoubleClick(null);
  };

  useEffect(() => {
    if (editTitle.current) {
      editTitle.current.focus();
    }

    const onClick = (event: any) => {
      if (editTitle.current?.contains(event.target)) {
        setToggleDoubleClick(null);
      }
    };

    document.addEventListener('click', onClick);

    return () => document.removeEventListener('click', onClick);
  }, [tooggleDoubleClick]);

  useEffect(() => {
    if (editTitle.current) {
      editTitle.current.focus();
    }
  }, [tooggleDoubleClick]);

  const onBlur = (toDo: Todo) => {
    editTodos(toDo);
  };

  const onEditting = (toDo: Todo) => {
    setToggleDoubleClick(toDo);
    setInputTitle(toDo.title);
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setToggleDoubleClick(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => selectCompleted(todo)}
        />
      </label>

      {(tooggleDoubleClick !== todo)
        ? (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditting(todo)}
          >
            {todo.title}
          </span>
        )
        : (
          <form
            onSubmit={() => editTodos(todo)}
          >
            <input
              data-cy="TodoTitle"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editTitle}
              value={inputTitle}
              onBlur={() => onBlur(todo)}
              onChange={event => setInputTitle(event.target.value)}
              onKeyDown={onKeyPress}
            />
          </form>
        )}

      {tooggleDoubleClick !== todo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => removeTodos(todo)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': (isRemoving && isRemoving.id === todo.id)
          || !todo.id || (isEditting?.id === todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
