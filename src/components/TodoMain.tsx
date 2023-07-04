import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onDelete:(todoId: number) => void;
  onCheck: (id: number, status: boolean) => void;
};

export const TodoMain: FC<Props> = ({
  todos,
  onCheck,
  onDelete,
}) => (
  <section className="todoapp__main">
    {todos?.map(todo => (
      <div
        key={todo.id}
        className={cn('todo',
          { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onCheck(todo.id, !todo.completed)}
          />
        </label>

        <span className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ))}
  </section>
);
