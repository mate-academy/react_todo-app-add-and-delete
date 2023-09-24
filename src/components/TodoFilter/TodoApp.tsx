// import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isModalVisible: boolean;
};

export const TodoApp: React.FC<Props> = ({
  todo,
  onDelete = () => {},
}) => {
  const { completed, title } = todo;
  // const [completedTodo, setCompletedTodo] = useState(completed);

  // const handleToggleCompleted = () => {
  //   setCompletedTodo(!completed);
  // };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          // onClick={handleToggleCompleted}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
