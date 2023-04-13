import { FC, useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from './Todo';
import { LoadContext } from '../../LoadContext';

interface Props {
  todo: Todo,
  onDelete: (id: number) => void,
}

export const TodoItem: FC<Props> = (props) => {
  const { todo, onDelete } = props;
  const {
    id,
    title,
    completed,
  } = todo;

  const [isCompleted, setIsCompleted] = useState(completed);
  const loadingTodos = useContext(LoadContext);

  return (
    <div className={cn('todo', { completed: isCompleted })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => setIsCompleted(prevState => !prevState)}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': loadingTodos.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
