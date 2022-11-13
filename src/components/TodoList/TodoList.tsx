import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  filteredTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({ filteredTodos }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map((todo) => {
      const {
        id,
        title,
        completed,
      } = todo;

      return (
        <div
          key={id}
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed },
          )}
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
          >
            ×
          </button>

          <Loader />
        </div>
      );
    })}
  </section>
);
