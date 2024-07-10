import { Todo } from '../types/Todo';
import '../styles/todo.scss';
import '../styles/todoapp.scss';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  deletingTodoId: number | null;
  onDelete: (id: number) => void;
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''}`}
        >
          {/* eslint-disable jsx-a11y/label-has-associated-control */
          /*
          eslint-disable jsx-a11y/control-has-associated-label */}
          <label className="todo__status-label" htmlFor={`${todo.id}`}>
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              id={`${todo.id}`}
              checked={todo.completed}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
          {/* overlay will cover the todo while it is being deleted or updated */}

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${deletingTodoId === todo.id ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {/* This todo is in loadind state */}
      {tempTodo && <TempTodo todo={tempTodo} />}

      {/* This todo is being edited */}
      {false && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          {/* This form is shown instead of the title and remove button */}
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
