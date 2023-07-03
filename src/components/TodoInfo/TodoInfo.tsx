import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onRemoveTodo: (todoId: number) => void;
  loadingTodo: number[];
}

export const TodoInfo: FC<Props> = ({ todo, onRemoveTodo, loadingTodo }) => {
  const isLoadingTodo = loadingTodo.includes(todo.id);

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoadingTodo,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
