import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isCompleted: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isCompleted,
}) => {
  const [detedTodoId, setDeletedTodoId] = useState(0);

  const handleDeleteTodo = (id: number) => {
    setDeletedTodoId(id);
    onDeleteTodo(id);
  };

  const isActive = detedTodoId === todo.id || isCompleted;

  const { title, id, completed } = todo;

  return (
    <div className={classNames('todo', { completed })} key={id}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <div
        className={classNames('modal', 'overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
