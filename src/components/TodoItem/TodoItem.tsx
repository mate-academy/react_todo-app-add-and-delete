import classNames from 'classnames';
import { Todo } from '../../types/Todo';

// import { onDelete } from "../../api/todos"

type Props = {
  todo: Todo,
  withLoader?: boolean,
  onRemoveTodo: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({ 
  todo, 
  withLoader, 
  onRemoveTodo }) => {
  const { id, completed, title } = todo;

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          // checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button 
        type="button" 
        className="todo__remove" 
        onClick={() => onRemoveTodo(id)}
      >
        ×
      </button>

      {withLoader && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
