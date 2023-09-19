import className from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo | null,
  isSubmiting: boolean,
};

export const TodoItem: React.FC<Props> = ({ tempTodo, isSubmiting }) => {
  return (
    <>
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>
        <span className="todo__title">{tempTodo?.title}</span>
        <div className={className('modal overlay', {
          'is-active': isSubmiting,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
