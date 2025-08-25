/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[] | null;
  onTodoTitleUpdate?: (title: string) => Promise<void>;
  onTodoDelete?: (id: number) => void;
  onOneTodoToggle?: (id: number) => void;
};

const TodosComponent: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onTodoTitleUpdate = () => Promise.resolve(),
  onTodoDelete = () => {},
  onOneTodoToggle = () => {},
 }) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const inputEditElement = useRef<HTMLInputElement>(null);

  const handleEditSubmit = () => {
    if (!query.trim()) {
      return;
    }

    onTodoTitleUpdate(query).then(() => setQuery(''));
    setEditedTodoId(null);
  }

  const handleDoubleClick = (event: React.MouseEvent<HTMLSpanElement>, id: number) => {
    setQuery(todos.find(todo => todo.id === id)?.title as string);
    setEditedTodoId(id);
  }

  const handleTodoRemove = (id: number) => {
    onTodoDelete(id);
  }

  useEffect(() => {
    if (inputEditElement.current) {
      inputEditElement.current.focus();
    }
  }, [editedTodoId]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={cn("todo", {
          completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => onOneTodoToggle(todo.id)}
            />
          </label>

          {editedTodoId === todo.id ? (
            <form onSubmit={(event) => {
                event.preventDefault()
                handleEditSubmit();
              }}
            >
              <input
                ref={inputEditElement}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => handleEditSubmit()}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={event => handleDoubleClick(event, todo.id)}
              >
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleTodoRemove(todo.id)}
              >
                ×
              </button>
            </>
          )}

          <div data-cy="TodoLoader"
            className={cn("modal overlay", {
              'is-active': loadingTodoIds?.includes(todo.id)
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};

export const Todos = React.memo(TodosComponent);
