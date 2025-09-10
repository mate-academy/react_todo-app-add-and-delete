import { ErrorType, LoadedTodo, Todo } from '../../types/Types';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  loadedTodo: LoadedTodo;
  tempTodo: Todo | null;
  deletedTodo: number | null;
  setDeletedTodo: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  loadedTodo,
  tempTodo,
  deletedTodo,
  setDeletedTodo,
}) => {
  const handleDelete = (id: number) => {
    setDeletedTodo(id);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));

        setDeletedTodo(null);
      })

      .catch(() => {
        setError(ErrorType.CantDelete);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames({
            'todo completed': todo.completed,
            'todo item-enter-done': !todo.completed,
          })}
          key={todo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={todo.completed}
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
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                (loadedTodo.isLoad && loadedTodo.id === todo.id) ||
                deletedTodo === todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames({
            'todo completed': tempTodo.completed,
            'todo item-enter-done': !tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(tempTodo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', { 'is-active': loadedTodo })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
