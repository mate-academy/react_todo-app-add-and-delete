import cn from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../context/TodoContext';
// import { Todo } from '../types/Todo';

export const TodoItem = () => {
  const { newTodoTitle } = useContext(TodosContext);

  return (
    <div
      data-cy="Todo"
      className={cn({
        todo: true,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          title="todoInput"
          // checked={false}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {newTodoTitle}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        // onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className="modal overlay is-active"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
