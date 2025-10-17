// import { ErrorCode } from '../../types/Error';
import { Todo } from '../../types/Todo';

import { Loader } from '../Loader/Loader';
import cn from 'classnames';

type Props = {
  tempTodo?: Todo | null;
  todos: Todo[];
  updatingId: number | null;
  // loading?: boolean;
  deletingIds: number[];
  // onShowError: (code: Exclude<ErrorCode, null>) => void;
  // onClearError: () => void;
  onStatusUpdate: (id: number, completed: boolean) => void;
  TodoDeleteButton: (id: number) => void;
};

export const Main: React.FC<Props> = ({
  tempTodo,
  todos,
  updatingId,
  // loading,
  deletingIds,
  TodoDeleteButton = () => {},
  onStatusUpdate = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoading =
          todo.id === updatingId || deletingIds.includes(todo.id);
        // const isLoading =
        //   loading || todo.id === updatingId || deletingIds.includes(todo.id);

        return (
          <div
            data-cy="Todo"
            className={cn('todo', {
              completed: todo.completed === true,
            })}
            key={todo.id}
          >
            <label
              className="todo__status-label"
              aria-label="Toggle todo status"
            >
              <input
                id={`todo-status-${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={event =>
                  onStatusUpdate(todo.id, event.target.checked)
                }
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => TodoDeleteButton(todo.id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            {/* {isUpdating && <span style={{ marginLeft: 8 }}>loading…</span>} */}
            {/* {isUpdating && <Loader />} */}
            <Loader isActive={isLoading} />
          </div>
        );
      })}
      {tempTodo && (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: tempTodo.completed === true,
          })}
          key={tempTodo.id}
        >
          <label className="todo__status-label" aria-label="Toggle todo status">
            <input
              id={`todo-status-${tempTodo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              disabled
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
            aria-disabled
            title="Creating..."
          >
            ×
          </button>
          <Loader isActive={true} />
        </div>
      )}
    </section>
  );
};
