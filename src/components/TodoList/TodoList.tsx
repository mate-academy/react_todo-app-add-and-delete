/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  tempTodo,
  deleteTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {[...todos, tempTodo]
        .filter((todo): todo is Todo => todo !== null)
        .filter((todo: Todo) => {
          if (filter === 'active') {
            return !todo.completed;
          }

          if (filter === 'completed') {
            return todo.completed;
          }

          return true;
        })
        .map(todo => {
          const checkboxId = `todo-status-${todo.id}`;

          return (
            <div
              data-cy="Todo"
              className={`todo${todo.completed ? ' completed' : ''}`}
              key={todo.id}
            >
              <label className="todo__status-label" htmlFor={checkboxId}>
                <input
                  id={checkboxId}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
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
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active':
                    todo.id === 0 || deletingTodoIds.includes(todo.id),
                })}
              >
                {/* eslint-disable-next-line */}
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}
    </section>
  );
};
