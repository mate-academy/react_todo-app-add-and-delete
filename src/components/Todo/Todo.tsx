import { FC } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todo: TodoType;
  deleteTodo: (todoId: number) => void;
  loading: boolean,
}

export const Todo: FC<Props> = ({ todo, deleteTodo, loading }) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': loading,
      })}
      >
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};
