import cn from 'classnames';
import React from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void
  changeTodo: (todoId: number, data: Partial<Todo>) => void
};

export const TodoList: React.FC<Props>
= ({ todos, removeTodo, changeTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={todo.completed}
              onChange={() => {
                changeTodo(todo.id, { completed: !todo.completed });
              }}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              removeTodo(todo.id);
            }}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className="modal overlay"
          >

            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
