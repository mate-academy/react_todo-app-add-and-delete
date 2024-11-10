/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
  removeTodo: (todoId: number) => void;
  tempTodo: string;
  deletingCompletedTodos: Todo[] | null;
  setDeletingCompletedTodos: (deletingCompletedTodos: Todo[] | null) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  removeTodo,
  tempTodo,
  deletingCompletedTodos,
  setDeletingCompletedTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const { id, completed, title } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
            key={id}
          >
            <label className="todo__status-label">
              {completed ? (
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked
                />
              ) : (
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              )}
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                removeTodo(todo.id);
                setDeletingCompletedTodos([todo]);
              }}
            >
              x
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal', 'overlay', {
                'is-active': deletingCompletedTodos?.some(
                  task => task.id === todo.id,
                ),
                // removeTodoId === todo.id ||
              })}
            >
              <div
                className={classNames(
                  'modal-background',
                  'has-background-white-ter',
                )}
              />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            x
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div
              className={classNames(
                'modal-background',
                'has-background-white-ter',
              )}
            />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
