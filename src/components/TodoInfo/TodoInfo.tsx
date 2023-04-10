import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => (
  <div className={classNames(
    'todo', { completed: todo.completed },
  )}
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        checked
      />
    </label>

    <span className="todo__title">{todo.title}</span>

    {/* Remove button appears only on hover */}
    <button type="button" className="todo__remove">×</button>
  </div>
);
