import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  deleteTodo: (todoId: number) => void;
  todos: Todo[];
  isLoading: boolean;
};

export const TodoMain: React.FC<Props> = ({
  deleteTodo,
  todos,
  isLoading,
}) => {
  const [todoIdForDelete, setTodoIdForDelete] = useState(0);

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={(classNames('todo', {
            completed: todo.completed,
          }))}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              deleteTodo(todo.id);
              setTodoIdForDelete(todo.id);
            }}
          >
            ×
          </button>

          <div className={classNames('modal overlay', {
            'is-active': isLoading && todoIdForDelete === todo.id,
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
