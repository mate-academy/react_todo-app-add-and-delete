import { Todo } from '../types/Todo';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  tempTodo: Todo | null;
};

export const TempTodo: React.FC<Props> = ({ tempTodo }) => (
  <div
    data-cy="Todo"
    className={tempTodo?.completed ? 'todo completed' : 'todo'}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={tempTodo?.completed}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {tempTodo?.title}
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
