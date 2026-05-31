import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { OnTodoChange, Todo } from '../../types/Todo';
import './todo.scss';
import { handleKey } from '../../utils/handleKey';

type Props = {
  todo: Todo;
  onTodoChange?: OnTodoChange;
  isLoading?: boolean;
  isDoubleclicked?: boolean;
  setIsDoubleclicked?: (isDoubleclicked: boolean) => void;
  editingTodos?: number[] | null;
  setEditingTodos?: (editingTodos: number[] | null) => void;
  onDeleteTodo?: (todoId: number) => void;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  onTodoChange = () => {},
  isLoading = false,
  setIsDoubleclicked = () => {},
  editingTodos = null,
  isDoubleclicked = false,
  setEditingTodos = () => {},
  onDeleteTodo = () => {},
}) => {
  const [todoTitle, setTodoTitle] = useState(todo.title.trim());
  const refInput = React.useRef<HTMLInputElement>(null);
  const editingThisTodo = editingTodos?.includes(todo.id);

  useEffect(() => {
    if (isLoading && isDoubleclicked && editingThisTodo && refInput.current) {
      refInput.current.focus();
    }
  }, [isLoading, isDoubleclicked, editingThisTodo]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedTitle = todoTitle.trim();

    setTodoTitle(trimmedTitle);

    onTodoChange(todo, 'title', trimmedTitle);
  };

  const handleEscKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = handleKey(e, 'Escape');

    if (key) {
      setTodoTitle(todo.title.trim());
      setIsDoubleclicked(false);
      setEditingTodos(null);
    }
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={e => {
              onTodoChange(todo, 'completed', e.currentTarget.checked);
              setEditingTodos([todo.id]);
            }}
          />
          <span className="is-sr-only">Toggle todo status</span>
        </label>

        {editingThisTodo && isDoubleclicked ? (
          <form onSubmit={handleSubmit} key={todo.id}>
            <input
              ref={refInput}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              autoFocus
              value={todoTitle}
              onChange={e => {
                setTodoTitle(e.currentTarget.value);
                setEditingTodos([todo.id]);
              }}
              onBlur={() => isDoubleclicked && handleSubmit()}
              onDoubleClick={() => {
                setIsDoubleclicked(true);
                setEditingTodos([todo.id]);
              }}
              onKeyUp={handleEscKey}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setEditingTodos([todo.id]);
                setIsDoubleclicked(true);
              }}
            >
              {todoTitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                onDeleteTodo(todo.id);
                setEditingTodos([todo.id]);
              }}
            >
              ×
            </button>
          </>
        )}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoading && editingThisTodo,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
