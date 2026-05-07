import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import '../styles/todo.scss';

type Props = {
  todos: Todo[];
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: number, todo: Todo) => void;
  editing: Todo | null;
  setEditing: (todo: Todo | null) => void;
  loadingTodo: boolean;
  setActiveTodos: (todo: Todo[] | null) => void;
  activeTodos: Todo[] | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  deleteTodo,
  editing,
  setEditing,
  loadingTodo,
  setActiveTodos: setActiveTodo,
  activeTodos,
  tempTodo,
}) => {
  const [editedValue, setEditedValue] = useState('');

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed === true,
            })}
            onDoubleClick={e => {
              e.preventDefault();
              setActiveTodo([todo]);
              setEditing(todo);
              setEditedValue(todo.title);
            }}
          >
            <label
              htmlFor={`checkbox-${todo.id}`}
              className="todo__status-label"
            >
              {''}
              <input
                data-cy="TodoStatus"
                type="checkbox"
                id={`checkbox-${todo.id}`}
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  updateTodo({ ...todo, completed: !todo.completed });
                  setActiveTodo([todo]);
                }}
              />
            </label>

            {todo.id === editing?.id ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  updateTodo({ ...todo, title: editedValue });
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={editedValue}
                  onBlur={() => setEditing(null)}
                  onChange={e => setEditedValue(e.target.value)}
                />
              </form>
            ) : (
              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>
            )}

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                setActiveTodo([todo]);
                deleteTodo(todo.id, todo);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active':
                  (loadingTodo &&
                    activeTodos?.some(
                      activeTodo => activeTodo.id === todo.id,
                    )) ||
                  todo.id === tempTodo?.id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div key={tempTodo.id} data-cy="Todo" className="todo">
          <label
            htmlFor={`checkbox-${tempTodo.id}`}
            className="todo__status-label"
          >
            {''}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              id={`checkbox-${tempTodo.id}`}
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
