/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { changeTodo, deleteTodo } from '../../api/todos';
import { TodosContext } from '../../TodosContext/TodoProvider';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  onError: (err: string) => void;
  onUpdate: (todo: Partial<Todo>) => void;
}

export const TodoComponent: React.FC<Props> = (props) => {
  const {
    todo, onDelete, onError, onUpdate,
  } = props;

  const loading = todo.id === 0;
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), [editing]);

  const { upatingTodos, addTodoForUpdate, removeTodoForUpdate }
    = useContext(TodosContext);

  const deleting = upatingTodos.some(({ id }) => todo.id === id);

  const showUpdating = deleting || loading || updating;

  function removeTodo(): void {
    addTodoForUpdate(todo);

    deleteTodo(todo.id)
      .then(() => onDelete(todo.id))
      .catch(() => {
        onError('Unable to delete a todo');
        removeTodoForUpdate(todo);
      })
      .finally(() => removeTodoForUpdate(todo));
  }

  const toogleCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const changedTodo: Partial<Todo> = {
      id: todo.id,
      completed: event.target.checked,
    };

    setUpdating(true);
    changeTodo(changedTodo)
      .then(res => {
        onUpdate(res);
      })
      .catch(() => onError('Unable to update a todo'))
      .finally(() => setUpdating(false));
  };

  function handleDoubleClick(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ): void {
    if (event.detail === 2) {
      setEditing(true);
    }
  }

  function cancelEditing():void {
    setEditing(false);
  }

  function saveEditedTodo() {
    const value = newTitle.trim();

    setUpdating(true);

    if (value !== todo.title && !!value) {
      const updatedTodo: Partial<Todo> = {
        id: todo.id,
        title: value,
      };

      changeTodo(updatedTodo)
        .then(onUpdate)
        .catch(() => onError('Unable to update a todo'))
        .finally(() => setUpdating(false));
    }

    setEditing(false);
  }

  function handleKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      saveEditedTodo();
    }

    if (event.key === 'Escape') {
      cancelEditing();
    }
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toogleCheck}
        />
      </label>

      {editing && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onBlur={saveEditedTodo}
            onKeyDown={handleKey}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </form>
      )}

      {!editing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo()}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': showUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

/* {/* This todo is being edited
<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
    />
  </label>

   This form is shown instead of the title and remove button
  <form>
    <input
      data-cy="TodoTitleField"
      type="text"
      className="todo__title-field"
      placeholder="Empty todo will be deleted"
      value="Todo is being edited now"
    />
  </form>

  <div data-cy="TodoLoader" className="modal overlay">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
</div>
 This todo is in loadind state
<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
    />
  </label>

  <span data-cy="TodoTitle" className="todo__title">
    Todo is being saved now
  </span>

  <button type="button" className="todo__remove" data-cy="TodoDelete">
    ×
  </button>

  {/* 'is-active' class puts this modal on top of the todo
  <div data-cy="TodoLoader" className="modal overlay is-active">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
</div> */
