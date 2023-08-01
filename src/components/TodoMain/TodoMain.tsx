import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoErrorType } from '../../types/TodoErrorType';

type Props = {
  todos: Todo[],
  setHasError: (error: TodoErrorType) => void,
  setTodosFromServer: React.Dispatch<React.SetStateAction<Todo[]>>,
  handleDeleteTodo: (todoId: number) => void,
  tempTodo: Todo | null;
  isLoading: boolean;
  loadingIds: number[];
};

export const TodoMain: React.FC<Props> = ({
  todos,
  setHasError,
  handleDeleteTodo,
  tempTodo,
  loadingIds,
  // isLoading,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames('todo',
            { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => setHasError(TodoErrorType.noError)}
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>

          {loadingIds.includes(todo.id) && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              disabled
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <button
            type="button"
            className="todo__remove"
            disabled
          >
            ×
          </button>
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
