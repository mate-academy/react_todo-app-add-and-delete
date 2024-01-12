import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Prop = {
  todos: Todo[],
  deleteTodo: (todoID: number) => void,
};

export const TodoList:React.FC<Prop> = React.memo(
  ({ todos, deleteTodo }) => {
    return (
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            className={classNames(
              'todo',
              {
                completed: todo.completed,
              },
            )}
          >
            <label
              id={todo.id.toString(10)}
              className="todo__status-label"
            >
              <input
                type="checkbox"
                id={todo.id.toString(10)}
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </li>
        ))}
      </ul>
    );
  },
);
