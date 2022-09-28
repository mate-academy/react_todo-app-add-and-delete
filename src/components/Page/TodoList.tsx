import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({ visibleTodos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(({ id, title }) => (
        <div
          data-cy="Todo"
          className="todo"
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {/* <div data-cy="Todo" className="todo completed">
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        defaultChecked
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">HTML</span>
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDeleteButton"
    >
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

    <span data-cy="TodoTitle" className="todo__title">CSS</span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDeleteButton"
    >
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
        defaultValue="JS"
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

    <span data-cy="TodoTitle" className="todo__title">React</span>
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDeleteButton"
    >
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

    <span data-cy="TodoTitle" className="todo__title">Redux</span>
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDeleteButton"
    >
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
