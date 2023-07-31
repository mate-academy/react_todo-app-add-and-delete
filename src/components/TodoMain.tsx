import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  deleteTodo: (todoId: number) => void;
  todos: Todo[];
  isLoading: boolean;
  listOfTodosIds: number[];
  tempTodo: Todo | null;
};

export const TodoMain: React.FC<Props> = ({
  deleteTodo,
  todos,
  isLoading,
  listOfTodosIds,
  tempTodo,
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
            'is-active': isLoading
              && (todoIdForDelete === todo.id
              || listOfTodosIds.includes(todo.id)),
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
              'modal overlay is-active': isLoading,
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
