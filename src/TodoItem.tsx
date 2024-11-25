import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { editTodos } from './api/todos';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  todos,
  updateTodos,
  setErrorMessage,
  handleDelete,
  tempTodo,
  isDeleting,
}) => {
  const [editingId, setEditingId] = useState<null | number>(null);
  const [editingVal, setEditingVal] = useState('');

  const ref = useRef<HTMLInputElement | null>(null);

  const handleDouble = (todoId: number, todoTitle: string) => {
    setEditingId(todoId);
    setEditingVal(todoTitle);
  };

  const handleSubmit = async (todoId: number) => {
    if (editingVal.trim() === '') {
      handleDelete(todoId);

      return;
    }

    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (todoToUpdate) {
      const updatedTodo = {
        title: editingVal,
        todoId: todoToUpdate.id,
      };

      try {
        await editTodos(updatedTodo);
        updateTodos(todoId, editingVal);
        setEditingId(null);
      } catch (error) {
        setErrorMessage('Unable to update a todo');
      }
    }
  };

  useEffect(() => {
    if (editingId !== null && ref.current) {
      (ref.current as HTMLInputElement).focus();
    }
  }, [editingId]);

  if (tempTodo && tempTodo.id === id) {
    return (
      <div data-cy="Todo" className="todo">
        <label htmlFor={`todo-0`} className="todo__status-label">
          {}
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            id={`todo-0`}
            disabled
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled
        >
          ×
        </button>
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label htmlFor={`todo-${id}`} className="todo__status-label">
        {}
        <input
          id={`todo-${id}`}
          checked={completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {}}
        />
      </label>

      {editingId === id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit(id);
          }}
        >
          <input
            ref={ref}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingVal}
            onChange={event => {
              setEditingVal(event.target.value);
            }}
            onBlur={() => {
              handleSubmit(id);
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleDouble(id, title)}
        >
          {title}
        </span>
      )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
        disabled={isDeleting}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isDeleting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
