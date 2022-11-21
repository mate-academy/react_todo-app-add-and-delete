import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import '../../styles/index.scss';

type Props = {
  todos: Todo[];
  newTodo: Todo | null;
  isTodoOnLoad: boolean;
  onDelete: (id: number) => void;
  pickedTodoId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  newTodo,
  isTodoOnLoad,
  onDelete,
  pickedTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {(todos.length > 0 || isTodoOnLoad) && (
        todos.map((todo: Todo) => {
          return (
            <div
              data-cy="Todo"
              className={classNames(
                'todo',
                { completed: todo.completed },
              )}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => onDelete(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal',
                  'overlay',
                  { 'is-active': pickedTodoId.includes(todo.id) },
                )}
              >
                <div
                  className="modal-background has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          );
        })
      )}

      {(isTodoOnLoad && newTodo) && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {newTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
