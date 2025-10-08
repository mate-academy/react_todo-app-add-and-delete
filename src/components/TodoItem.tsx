/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  handleDeleteTodo: (id: number) => void;
  handleUpdateTodoText: (id: number, title: string) => void;
  handleUpdateTodoStatus: (
    todoId: number,
    title: string,
    newStatus: boolean,
  ) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  activeTodoId: number | null;
  setOriginalTitle: (title: string) => void;
  activeTodoIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editingId,
  setEditingId,
  handleDeleteTodo,
  handleUpdateTodoText,
  handleUpdateTodoStatus,
  handleKeyDown,
  setTodos,
  activeTodoId,
  setOriginalTitle,
  activeTodoIds,
}) => {
  const isSubmittingRef = useRef(false);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : 'item-enter-done'}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            handleUpdateTodoStatus(todo.id, todo.title, !todo.completed)
          }
        />
      </label>

      {editingId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();

            if (isSubmittingRef.current) {
              return;
            }

            isSubmittingRef.current = true;

            const newValue = todo.title.trim();

            if (newValue === '') {
              handleDeleteTodo(todo.id);
            } else {
              handleUpdateTodoText(todo.id, newValue);
              setEditingId(null);
            }

            setTimeout(() => {
              isSubmittingRef.current = false;
            }, 100);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={todo.title}
            onChange={e =>
              setTodos(prev =>
                prev.map(t =>
                  t.id === todo.id ? { ...t, title: e.target.value } : t,
                ),
              )
            }
            onKeyDown={e => handleKeyDown(e, todo.id)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingId(todo.id);
              setOriginalTitle(todo.title);
            }}
          >
            {todo.title.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          activeTodoId === todo.id || activeTodoIds.includes(todo.id)
            ? 'is-active'
            : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
