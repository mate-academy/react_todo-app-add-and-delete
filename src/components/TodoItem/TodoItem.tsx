import { FC, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoProps {
  todo: Todo;
  onRemove: (id: number) => void;
  loadTodoById: number[];
}

export const TodoItem: FC<TodoProps> = ({ todo, onRemove, loadTodoById }) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const [isCompleted, setIsCompleted] = useState(completed);
  const isActiveTodo = loadTodoById.includes(id);

  const handleIsCompletedChange = () => {
    setIsCompleted(completedTodo => !completedTodo);
  };

  return (
    <div className={classNames('todo', {
      completed: isCompleted,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleIsCompletedChange}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemove(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isActiveTodo,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
