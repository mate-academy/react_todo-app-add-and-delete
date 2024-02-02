/* eslint-disable object-curly-newline */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoItem } from './Todo';
import { TodoContext } from '../contexts/TodoContext';
import { Filtering } from '../types/Filtering';

export const TodoList: React.FC = () => {
  const { todos, filtering, tempTodo } = useContext(TodoContext);

  const visibleTodos = (currentFiltering: Filtering) => {
    switch (currentFiltering) {
      case Filtering.ALL:
        return todos;
      case Filtering.ACTIVE:
        return todos.filter((t) => !t.completed);
      case Filtering.COMPLETED:
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos(filtering).map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
          )}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* overlay will cover the todo while it is being updated */}
          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal',
              'overlay',
              'is-active',
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {/* <div data-cy="Todo" className="todo completed">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Completed Todo
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Not Completed Todo
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Todo is being saved now
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </section>
  );
};
