/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (a: number) => void;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  handleDeleteTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(({ title, id, completed }) => (
        <>
          <div
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed: completed })}
          >
            <label htmlFor={`${id}`} className="todo__status-label">
              <input
                id={`${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': loadingIds.includes(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </>
      ))}
      {tempTodo && <TodoItem tempTodo={tempTodo} />}
      {/* This todo is being edited */}
      {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label> */}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form> */}

      {/* <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </section>
  );
};
