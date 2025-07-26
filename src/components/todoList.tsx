import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  sortedUserTodo: Todo[];
  onDelete: (value: number) => Promise<void>;
  isLoader: string | number | null;
  tempTitle: string;
};

export const TodoList = ({
  sortedUserTodo,
  onDelete,
  isLoader,
  tempTitle,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {sortedUserTodo.map(listTodo => {
        const isThisTodoLoading = isLoader === listTodo.id;

        return (
          <div
            key={listTodo.id}
            data-cy="Todo"
            className={`todo item-enter-done ${listTodo.completed ? 'completed' : ''}`}
          >
            <label htmlFor="todoStatus" className="todo__status-label">
              <input
                id="todoStatus"
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={listTodo.completed}
                readOnly
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {listTodo.title}
            </span>

            <button
              onClick={() => onDelete(listTodo.id)}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal', 'overlay', {
                'is-active': isThisTodoLoading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {isLoader === 'temp' && (
        <div data-cy="Todo" className="todo temp-item-enter-done">
          <label htmlFor="todoStatus" className="todo__status-label">
            <input
              id="todoStatus"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              readOnly
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTitle}
          </span>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
