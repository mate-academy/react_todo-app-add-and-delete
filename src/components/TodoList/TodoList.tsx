import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  loading: boolean,
  todos: Todo[],
  deleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  loading,
  todos,
  deleteTodo,
  tempTodo,
}) => {
  const [todoForDelete, setTodoForDelete] = useState<number | null>(null);

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={classNames('todo', {
            'todo completed': todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              deleteTodo(todo.id);
              setTodoForDelete(todo.id);
            }}
          >
            ×
          </button>

          <div className={classNames('modal overlay', {
            'modal overlay is-active': loading && todo.id === todoForDelete,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo
        && (
          <div className={classNames('todo', {
            'todo completed': tempTodo.completed,
          })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(tempTodo.id)}
            >
              ×
            </button>

            <div className={classNames('modal overley', {
              'modal overlay is-active': loading,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
    </section>
  );
};
