import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  title: string,
  isAdding: boolean,
  isDeletedId: number;
  handleDelete: (id: number) => void;
  deletedIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos, title, isAdding, isDeletedId, handleDelete, deletedIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isDeletedId === todo.id
                  || deletedIds.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
