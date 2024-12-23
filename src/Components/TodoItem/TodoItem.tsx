import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  inEditedMode?: boolean;
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  setEditedTodoId: Dispatch<SetStateAction<null | number>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  inEditedMode,
  onRemoveTodo: onRemoveTodo,
  onUpdateTodo: onUpdateTodo,
  setEditedTodoId,
}) => {
  const [todoTitleValue, setTodoTitleValue] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const checkTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const editTodo = () => {
    setEditedTodoId(todo.id);
  };

  const onBlure = async (
    event: React.FocusEvent<HTMLFormElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedTitle = todoTitleValue.trim();

    if (todo.title === normalizedTitle) {
      return;
    }

    try {
      if (normalizedTitle === '') {
        await onRemoveTodo(todo.id);
      } else {
        await onUpdateTodo({ ...todo, title: normalizedTitle });
      }

      setEditedTodoId(null);
    } catch (error) {
      inputRef?.current?.focus();
    }
  };

  const onEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setTodoTitleValue(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`todo-check-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-check-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={checkTodo}
        />
      </label>

      {inEditedMode ? (
        <form onSubmit={onBlure} onBlur={onBlure}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitleValue}
            onChange={event => setTodoTitleValue(event.target.value)}
            onKeyUp={onEscape}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={editTodo}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onRemoveTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
