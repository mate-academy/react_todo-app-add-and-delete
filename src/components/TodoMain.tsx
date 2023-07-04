import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo:(todoId: number) => Promise<boolean>;
  onCheck: (id: number, status: boolean) => Promise<Todo>;
};

export const TodoMain: FC<Props> = ({
  todos,
  onCheck,
  deleteTodo,
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
          onClick={() => deleteTodo(todo.id)}
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
