// .. TempTodoItem.tsx
import type { Todo } from '../types/Todo';

interface TempTodoItemProps {
  tempTodo: Todo;
}

export const TempTodoItem = ({ tempTodo }: TempTodoItemProps) => {
  return (
    <div data-cy="Todo" className="todo">
      <label
        htmlFor="tempTodo"
        className="todo__status-label"
        aria-label="Toggle todo status"
      >
        <input
          id="tempTodo"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
