/* eslint-disable prettier/prettier */
import React, { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  markCompleted: (todo: Todo) => void;
  removeTodo: (todo: Todo) => void;
  changeTitle: (todo: Todo, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  markCompleted,
  removeTodo,
  changeTitle,
}) => {
  const [loader, setLoader] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleDeleteTodo() {
    setLoader(true);
    await removeTodo(todo);
    setLoader(false);
  }

  async function toggle() {
    setLoader(true);
    await markCompleted(todo);
    setLoader(false);
  }


  function handlgeInputClick() {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  async function handleTitleChange(
    e:
    | React.KeyboardEvent<HTMLInputElement>
    | React.FocusEvent<HTMLInputElement, Element>,
  ) {
    const trimmedTitle = (e.target as HTMLInputElement).value.trim();

    if (!trimmedTitle) {
      handleDeleteTodo();

      return;
    }

    if (trimmedTitle === todo.title) {
      setEditing(false);

      return;
    }

    try {
      setLoader(true);
      await changeTitle(todo, trimmedTitle);
      setNewTitle(trimmedTitle);
      setEditing(false);
    } catch {
      return;
    } finally {
      setLoader(false);
    }
  }

  function HandleKeyPressed(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleTitleChange(e);
    }

    if (e.key === 'Escape') {
      setEditing(false);
      setNewTitle(todo.title);
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement, Element>) {
    if (e.target.value === todo.title) {
      setEditing(false);
    } else {
      handleTitleChange(e);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        {/* This comment is made because it fixes
        "A form label must be associated with a control" error */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={toggle}
        />
      </label>

      {editing ? (
        <input
          type="text"
          ref={inputRef}
          data-cy="TodoTitleField"
          value={newTitle}
          className="todo__title--edit"
          onChange={e => setNewTitle(e.target.value)}
          onBlur={e => handleBlur(e)}
          onKeyDown={e => HandleKeyPressed(e)}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handlgeInputClick}
        >
          {todo.title}
        </span>
      )}

      {!editing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            handleDeleteTodo();
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': loader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
