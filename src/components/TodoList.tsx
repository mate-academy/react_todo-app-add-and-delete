import cn from 'classnames';
import type { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  pendingIds: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  pendingIds,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {[...todos, ...(tempTodo ? [tempTodo] : [])].map(todo => {
      const isTemp = todo.id === 0;
      const isPending = pendingIds.includes(todo.id);

      return (
        <div key={todo.id}>
          <div
            data-cy="Todo"
            className={cn('todo item-enter-done', {
              completed: todo.completed,
            })}
          >
            <label
              className="todo__status-label"
              aria-label="Toggle todo status"
            >
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                readOnly
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {!isTemp && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(todo.id)}
              />
            )}

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': isTemp || isPending,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </div>
      );
    })}
  </section>
);
