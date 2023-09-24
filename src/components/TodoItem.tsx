import classNames from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from './TodoProvider';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = (
  { todo }: Props,
) => {
  const { deleteTodoHandler } = useContext(TodoContext);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isItemLoading, setIsItemLoading] = useState(todo.id === 0);
  const { isLoadingMap } = useContext(TodoContext);

  const handleCheckboxChange = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          id={todo.title}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxChange}
        />
      </label>

      <span
        className="todo__title"
        data-cy="TodoTitle"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setIsItemLoading(true);
          deleteTodoHandler(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': (isLoadingMap as { [key: number]: boolean })[todo.id]
            || isItemLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
