import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodosListProps = {
  todos: Todo[];
  filteredTodos: Todo[];
};

export const TodosList = ({ todos, filteredTodos }: TodosListProps) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  data-cy="TodoStatus"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => {}}
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
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
};
