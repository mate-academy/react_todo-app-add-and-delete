import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  isDeleting: number[];
};

export const Main: FC<Props> = ({
  filteredTodos,
  tempTodo,
  removeTodo,
  isDeleting,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos?.map((todo) => (
        <div
          key={todo.id}
          className={classNames('todo', { completed: todo.completed })}
        >
          {isDeleting.includes(todo.id!) && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" checked />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            onClick={() => removeTodo(todo.id!)}
            className="todo__remove"
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
        </div>
      ))}
      {tempTodo && (
        <div className="todo">
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
        </div>
      )}
    </section>
  );
};
