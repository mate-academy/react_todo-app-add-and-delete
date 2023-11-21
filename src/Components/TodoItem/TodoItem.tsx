import './style.scss';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  todo: Todo,
  edited: Todo | null,
  isTemp: boolean,
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>,
  todos: Todo[],
  setError: React.Dispatch<React.SetStateAction<Errors | null>>,
  deletionId?: number | null,
  setDeletionId?: React.Dispatch<React.SetStateAction<number | null>>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  edited,
  isTemp,
  setTodos = () => {},
  todos,
  setError,
  deletionId,
  setDeletionId = () => {},
}) => {
  const isCurrentEdited = edited?.id === todo.id;

  const handleDelete = (id: number) => {
    deleteTodo(id)
      .then(() => {
        const index = todos.findIndex(item => item.id === id);

        setDeletionId(todos[index].id);

        setTodos((prevTodos: Todo[]) => {
          const copy = [...prevTodos];

          copy.splice(index, 1);

          return copy;
        });
      })
      .catch(() => setError(Errors.DeleteError))
      .finally(() => setDeletionId(null));
  };

  return (
    <div
      data-cy="Todo"
      className={cn({
        todo: true,
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isCurrentEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn({
          modal: true,
          overlay: true,
          isActive: isTemp || deletionId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
