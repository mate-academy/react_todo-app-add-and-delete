import classNames from 'classnames';
import { memo, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isNewTodoLoading?: boolean;
};

export const TodoInfo: React.FC<Props> = memo(
  ({ todo, onDeleteTodo, isNewTodoLoading }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteTodo = async (todoId: number) => {
      setIsLoading(true);

      await onDeleteTodo(todoId);

      setIsLoading(false);
    };

    return (
      <div
        data-cy="Todo"
        key={todo.id}
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
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
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoading || isNewTodoLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
