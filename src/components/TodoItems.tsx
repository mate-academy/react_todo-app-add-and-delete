import React, { ChangeEvent, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos, updateTodos, USER_ID } from '../api/todos';
import { ErrorMessage } from './errorsMessage';

type ItemProps = {
  id: number;
  title: string;
  todoTemplate: Todo | null;
  completed: boolean;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};
export const TodoItems: React.FC<ItemProps> = ({
  id,
  title,
  todoTemplate,
  setErrorMessage,
  completed,
  setTodos,
}) => {
  const [focusItems, setFocusItems] = useState(false);
  const [inputTitle, setInputTitle] = useState(title);
  const [deleteCheck, setDeleteCheck] = useState(false);

  const saveInputOnBlur = () => {
    if (inputTitle == '') {
      setFocusItems(false);
      deleteTodos(id);
    } else {
      setFocusItems(false);
      updateTodos({
        id: id,
        userId: USER_ID,
        title: title,
        completed: !completed,
      });
    }
  };

  const saveInput = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      if (inputTitle == '') {
        setFocusItems(false);
        deleteTodos(id);
      } else {
        setFocusItems(false);
        updateTodos({
          id: id,
          userId: USER_ID,
          title: title,
          completed: !completed,
        });
      }
    }

    if (evt.key === 'Escape') {
      setFocusItems(false);
      setInputTitle(title);
    }
  };

  const onDelete = () => {
    setFocusItems(false);
    setDeleteCheck(true);
    deleteTodos(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.deleteError);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.noError);
        }, 3000);
      })
      .finally(() => {
        setDeleteCheck(false);
      });
  };

  const ChangedBox = () => {
    setFocusItems(false);
    const todoWithNewStatus: Todo = {
      id: id,
      userId: USER_ID,
      title: title,
      completed: !completed,
    };

    updateTodos(todoWithNewStatus)
      .then(() => {
        // setTodos(currentTodos =>
        //   currentTodos.filter(todo => todo.id !== id),
        // );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.updateError);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.noError);
        }, 3000);
      })
      .finally(() => {});
  };

  const doubleClickItem = () => {
    setFocusItems(true);
  };

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputTitle(e.target.value.trim());
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
    >
      <label htmlFor="title" className="todo__status-label">
        {''}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          id="title"
          className="todo__status"
          checked={completed}
          onChange={ChangedBox}
        />
      </label>
      {focusItems ? (
        <input
          data-cy="TodoTitle"
          className="todo__title"
          type="text"
          onKeyDown={saveInput}
          value={inputTitle}
          onChange={onTextChange}
          onBlur={saveInputOnBlur}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            onDoubleClick={doubleClickItem}
            className="todo__title"
          >
            {inputTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todoTemplate?.id === id || deleteCheck ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
