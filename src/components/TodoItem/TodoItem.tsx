import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import './TodoItem.scss';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  isLoading: boolean;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isLoading,
}) => {
  const [currentTodo, setCurrentTodo] = useState<number | null>(null);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" aria-label="Todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDeleteTodo(todo.id);
          setCurrentTodo(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': (isLoading && todo.id === currentTodo) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
