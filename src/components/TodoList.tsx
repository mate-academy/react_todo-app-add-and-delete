/* eslint-disable max-len */
/* eslint-disable quote-props */
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
  deletingIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  deletingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <>
          <div className={cn('todo', { 'completed': todo.completed })}>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>
            <span className="todo__title">{todo.title}</span>
            <div className={cn('modal overlay', { 'is-active': deletingIds.includes(todo.id) })}>
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(todo.id)}
            >
              ×
            </button>
          </div>

          {!todo.title && (
            <form>
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue="Todo is being edited now"
              />
            </form>
          )}
        </>
      ))}
    </section>
  );
};
