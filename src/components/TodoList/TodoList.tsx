import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[] | [];
  handleRemove: (param: number) => void;
  isAdding: boolean;
  selectedId: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleRemove,
  isAdding,
  selectedId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(({ id, title, completed }) => (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed },
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

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleRemove(id)}
          >
            ×
          </button>

          {/* {selectedId.includes(id)
            && (
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )} */}

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
      ))}
    </section>
  );
};
