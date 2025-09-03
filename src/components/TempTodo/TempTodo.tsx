/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todos';

interface Props {
  tempTodo: Todo;
}

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  return (
    <div className="todo" data-cy="Todo">
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>
      <span className="todo__title" data-cy="TodoTitle">
        {tempTodo.title}
      </span>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
