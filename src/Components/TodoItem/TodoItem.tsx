import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { loader, deleteTodo, toggleTodoCompleted, editTodo } =
    useContext(TodosContext);

  const [editing, setEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(todo.title);
  const [editingId, setEditingId] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [editingId, editing]);

  const todoEditEnd = () => {
    setEditing(false);
    setEditingId(todo.id.toString());
  };

  const todoEditStart = () => {
    setEditing(true);
    setEditingId(todo.id.toString());
  };

  const handleFocusMiss = () => {
    todoEditEnd();
    editTodo(todo.id, editingValue.trim());
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      event.preventDefault();
      todoEditEnd();
      editTodo(todo.id, editingValue.trim());
    }
  };

  return (
    <div
      key={todo.id.toString()}
      data-cy="Todo"
      className={classNames('todo', {
        editing: editing,
        completed: todo.completed,
      })}
      onDoubleClick={todoEditStart}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label" htmlFor={todo.id.toString()}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={todo.id.toString()}
          checked={todo.completed}
          onChange={event =>
            toggleTodoCompleted(+event.target.id, todo.completed)
          }
        />
      </label>

      {editing ? (
        <form onSubmit={event => event.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={titleField}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingValue}
            onBlur={handleFocusMiss}
            onKeyUp={handleKeyUp}
            onChange={event => setEditingValue(event.target.value)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onClick={event => {
            event.preventDefault();
          }}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
