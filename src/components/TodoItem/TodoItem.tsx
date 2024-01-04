import { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Error } from '../../types/enums/Error';
import { DispatchContext } from '../../TodosContext';
import { ReducerType } from '../../types/enums/ReducerType';
import { TodoLoader } from '../TodoLoader/TodoLoader';

interface Props {
  todo: Todo
  load?: boolean
  updateTodos: () => void
}

export const TodoItem: React.FC<Props> = ({
  todo,
  load = false,
  updateTodos,
}) => {
  const dispatch = useContext(DispatchContext);
  const { completed, title, id } = todo;
  const [hover, setHover] = useState(false);
  const [editing] = useState(false);
  const [loading, setLoading] = useState(load);

  const isEditing = editing && !loading;
  const isHover = !editing && hover;

  const handleDeleteTodo = () => {
    setLoading(true);

    deleteTodo(id)
      .catch(() => dispatch({
        type: ReducerType.SetError,
        payload: Error.UnabletoDeleteATodo,
      }))
      .finally(() => {
        updateTodos();
        setLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>

      {
        isEditing
          ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>
          ) : (
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
          )
      }

      {
        isHover && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        )
      }

      {loading && <TodoLoader />}
    </div>
  );
};
