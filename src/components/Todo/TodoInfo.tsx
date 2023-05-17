import cn from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../contexts/TodosContext';

interface Props{
  todo: Todo;
  isWaitingResponse?: boolean;
}

export const TodoInfo:React.FC<Props> = ({
  todo,
  isWaitingResponse = false,
}) => {
  const [isHovered, setHover] = useState(false);
  const { removeTodos } = useContext(TodosContext);

  return (
    <div
      className={cn('todo', { completed: todo.completed })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {isHovered && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => {
            removeTodos([todo.id]);
          }}
        >
          ×
        </button>
      )}

      <div className={cn(
        'modal', ' overlay', { 'is-active': isWaitingResponse },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
