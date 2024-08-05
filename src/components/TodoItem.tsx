import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

interface TodoItemProps {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  loadingId: number | null;
  loading: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDeleteTodo,
  // loadingId,
  loading,
}) => {
  const { id, completed, title } = todo;
  const [isChecked, setisChecked] = useState(completed);

  const handleCheckboxChange = () => {
    setisChecked(!isChecked);
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: isChecked,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={loading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      {/* {loadingId === id && ( */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      {/* // )} */}
    </div>
  );
};
