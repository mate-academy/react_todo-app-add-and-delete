/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable max-len */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  setLoadingTodosIds: (value: number[]) => void;
  deleteTodos: (id: number) => Promise<void>,
  updateTodos: (todo: Todo) => Promise<void>,
  loadingTodosIds: number[] | null,
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, todo: Todo, title: string) => void;
  setEditingTodoId: (value: number | null) => void,
  editingTodoId: number | null,
}

const handleBlur = (onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, todo: Todo, title: string) => void, todo: Todo, query: string) => {
  // Create a synthetic 'Enter' key event
  const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });

  onKeyDown(enterEvent as unknown as React.KeyboardEvent<HTMLInputElement>, { ...todo, title: query }, todo.title);
};

export const TodoInList: React.FC<Props> = React.memo(({
  todo, setLoadingTodosIds: setLoadingTodoId, deleteTodos, updateTodos, loadingTodosIds, onKeyDown, editingTodoId, setEditingTodoId,
}) => {
  const [query, setQuery] = useState('');

  return (
    <>
      <div
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={() => {
              setLoadingTodoId([todo.id]);
              updateTodos({
                ...todo, completed: !todo.completed,
              });
            }}
          />
        </label>

        {
          todo.id !== editingTodoId ? (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => {
                  setEditingTodoId(todo.id);
                  setQuery(todo.title);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => {
                  setLoadingTodoId([todo.id]);
                  deleteTodos(todo.id);
                }}
              >
                ×
              </button>
            </>
          ) : (
            <form>
              <input
                type="text"
                className="todo__title-field"
                placeholder={classNames({ 'Empty todo will be deleted': query === '' })}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (query === '') {
                    setLoadingTodoId([todo.id]);
                    setEditingTodoId(null);
                    deleteTodos(todo.id);
                  } else {
                    onKeyDown(event, { ...todo, title: query }, todo.title);
                  }
                }}
                onBlur={() => {
                  if (query === '') {
                    setLoadingTodoId([todo.id]);
                    setEditingTodoId(null);
                    deleteTodos(todo.id);
                  } else {
                    handleBlur(onKeyDown, todo, query);
                    setLoadingTodoId([todo.id]);
                    setEditingTodoId(null);
                  }
                }}
                autoFocus
              />
            </form>
          )
        }

        <div className={classNames('modal overlay', { 'is-active': loadingTodosIds?.includes(todo.id) })}>
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
});
