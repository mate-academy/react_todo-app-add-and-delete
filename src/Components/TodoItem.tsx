/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../Contexts/TodoContext';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  selectedTodoId?: number | null;
  isLoading?: boolean;
  onSelect?: (id: number | null) => void;
};

const TodoItemComponent: React.FC<Props> = ({
  todo,
  selectedTodoId,
  isLoading = false,
  onSelect = () => {},
}) => {
  const { onDeleteTodo, onCompleteTodo } = useContext(TodoContext);

  const inputId = `todo-${todo.id}`;
  const isSelected = selectedTodoId === todo.id;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label htmlFor={inputId} className="todo__status-label">
        <input
          id={inputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onCompleteTodo(todo.id)}
        />
      </label>

      {!isSelected ? (
        <>
          <span
            onDoubleClick={() => onSelect(todo.id)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            onClick={() => onDeleteTodo(todo.id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            onBlur={() => onSelect(null)}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todo.title}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const TodoItem = React.memo(TodoItemComponent);
