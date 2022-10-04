import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;
  handleremoveTodo: (param: number) => void;
  isAdding: boolean;
  selectedId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleremoveTodo,
  isAdding,
  selectedId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(({ title, completed, id }) => {
        return (
          <div
            data-cy="Todo"
            className={classNames(
              'todo',
              {
                completed,
              },
            )}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleremoveTodo(id)}
            >
              ×
            </button>

            {(isAdding && selectedId.includes(id)) && (
              <div
                data-cy="TodoLoader"
                className="modal overlay is-active"
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader is-loading " />
              </div>
            )}
          </div>
        );
      })}

    </section>
  );
};
