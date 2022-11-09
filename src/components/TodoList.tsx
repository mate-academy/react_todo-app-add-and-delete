import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({ todos, handleDeleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => {
        return (
          <div
            data-cy="Todo"
            key={todo.id}
            className={classNames('todo', {
              completed: todo.completed,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked={todo.completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
