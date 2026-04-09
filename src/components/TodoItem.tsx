// components/TodoItem.tsx
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type TodoItemProps = {
  todo: Todo;
  todos: Todo[];
  selectedTodoId: number | null;
  setSelectedTodoId: (id: number | null) => void;
  titleToSet: string;
  setTitleToSet: (title: string) => void;
  loading: number[];
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onUpdate: (id: number, checked?: boolean, title?: string) => void;
  isProcessed?: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  todos,
  selectedTodoId,
  setSelectedTodoId,
  titleToSet,
  setTitleToSet,
  loading,
  onDelete,
  onToggle,
  onUpdate,
  isProcessed,
}) => {
  const isTempTodo = todo.id === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleToSet(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (titleToSet.trim() !== '') {
        onUpdate(todo.id, undefined, titleToSet);
      }

      setSelectedTodoId(null);
    } else if (e.key === 'Escape') {
      setSelectedTodoId(null);
    }
  };

  const handleDoubleClick = () => {
    setSelectedTodoId(todo.id);
    setTitleToSet(todo.title);
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
        'is-processing': isProcessed || isTempTodo,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${todo.id}`}
        data-cy="TodoStatusLabel"
      >
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
        />
        <span>{'\u200C'}</span>
      </label>
      {selectedTodoId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (titleToSet.trim() === '') {
              return;
            }

            onUpdate(todo.id, undefined, titleToSet);
            setSelectedTodoId(null);
          }}
          className="todo__title-field-container"
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={titleToSet}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
            onBlur={() => {
              if (titleToSet.trim() === '') {
                setSelectedTodoId(null);

                return;
              }

              const foundTodo = todos.find(task => task.id === selectedTodoId);

              if (foundTodo && titleToSet.trim() !== todo.title) {
                onUpdate(todo.id, undefined, titleToSet);
              }

              setSelectedTodoId(null);
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading.includes(todo.id) || isProcessed || isTempTodo,
        })}
      >
        {isProcessed || isTempTodo ? (
          <div className="todo__loader">
            <div className="loader"></div>
          </div>
        ) : null}

        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
