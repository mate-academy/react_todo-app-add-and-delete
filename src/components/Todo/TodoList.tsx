/* eslint-disable operator-linebreak */
import { TodoItem } from './TodoItem';
import { TodoFooter } from './TodoFooter';
import { useTodoContext } from '../../store/todoContext';

export const TodoList = () => {
  const { todos, todoLength } = useTodoContext();

  if (todoLength === 0) {
    return null;
  }

  return (
    <>
      <section
        className="todoapp__main"
        data-cy="TodoList"
      >
        {todos.length > 0 &&
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          ))}

        {/* <div
        data-cy="Todo"
        className="todo"
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
          CSS
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
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

      <div
        data-cy="Todo"
        className="todo"
      >
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

        <div
          data-cy="TodoLoader"
          className="modal overlay"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      <div
        data-cy="Todo"
        className="todo"
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
          React
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
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

      <div
        data-cy="Todo"
        className="todo"
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
          Redux
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
      </section>
      <TodoFooter />
    </>
  );
};
