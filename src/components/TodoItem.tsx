import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDeleteBtn: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({ todo, onDeleteBtn }) => {
  return (
    todo.id === 0 ? (
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">{todo.title}</span>
        <button type="button" className="todo__remove">×</button>

        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ) : (
      <div className={classNames('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            defaultChecked={todo.completed}
          />
        </label>

        <span className="todo__title">{todo.title}</span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          onClick={() => {
            onDeleteBtn(todo.id);
          }}
        >
          ×
        </button>
      </div>
    )
  );
};
