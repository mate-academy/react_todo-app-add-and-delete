import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo,
};

export const TempTodo: React.FC<Props> = ({
  tempTodo,
}) => {
  return (
    <div className="todo" data-cy="Todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {tempTodo.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div className="modal overlay is-active" data-cy="TodoLoader">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
