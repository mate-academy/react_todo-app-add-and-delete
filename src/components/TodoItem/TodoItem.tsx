import classNames from 'classnames';
import { FC } from 'react';

import { Props } from './TodoItem.props';

export const TodoItem: FC<Props> = ({
  todo,
  onRemoveTodo,
  selectedTodos,
  setSelectedTodos,
  onUpdate,
}) => {
  const handleRemove = () => {
    onRemoveTodo(todo.id);
    setSelectedTodos([todo.id]);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {todo.id ? (
        <>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
              className="todo__status"
              defaultChecked
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleRemove}
          >
            ×
          </button>
        </>
      ) : (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': selectedTodos.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
