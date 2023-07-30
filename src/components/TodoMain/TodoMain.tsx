import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoErrorType } from '../../types/TodoErrorType';

type Props = {
  todos: Todo[],
  setHasError: (error: TodoErrorType) => void,
  setTodosFromServer: React.Dispatch<React.SetStateAction<Todo[]>>,
  handleDeleteTodo: (todoId: number) => void,
};

export const TodoMain: React.FC<Props> = ({
  todos,
  setHasError,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {
        todos.map(todo => (
          <div
            key={todo.id}
            className={classNames(
              'todo',
              { complited: todo.completed },
            )}
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

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))
      }
    </section>
  );
};
