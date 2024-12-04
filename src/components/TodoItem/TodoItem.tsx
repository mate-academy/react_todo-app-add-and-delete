/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';

{
  /* This todo is in loadind state */
}

type Props = {
  tempTodo: Todo | null;
};

export const TodoItem: React.FC<Props> = ({ tempTodo }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label htmlFor={`tempTodo?.id`} className="todo__status-label">
        <input
          id={`tempTodo?.id`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo?.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
      {/* 'is-active' class puts this modal on top of the todo */}
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter"></div>
        <div className="loader"></div>
      </div>
    </div>
  );
};
