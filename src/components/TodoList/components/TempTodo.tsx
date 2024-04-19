/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../../types/Todo';

type Props = { tempTodo: Todo };

export const TempTodo: React.FC<Props> = ({ tempTodo }) => (
  <div data-cy="Todo" className={'todo'} key={tempTodo.id}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={tempTodo.completed}
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
