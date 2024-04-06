import { Todo } from './types/Todo';

interface Props {
  tempTodo: Todo;
}

export const TodoItem: React.FC<Props> = ({ tempTodo }) => (
  <div data-cy="Todo" className="todo">
    <label aria-label="Todo-status" className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={tempTodo.completed}
        onChange={() => {}}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {tempTodo.title}
    </span>

    <button type="button" className="todo__remove" data-cy="TodoDelete">
      ×
    </button>

    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
