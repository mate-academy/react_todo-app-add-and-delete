import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { removeTodo } from '../api/todos';

interface Props {
  todos: Todo[],
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setTodoWasDeleted: React.Dispatch<React.SetStateAction<boolean>>
}

export const TodoList: React.FC<Props> = ({
  todos, setError, setTodoWasDeleted,
}) => {
  return (
    <section className="todoapp__main is-loading">
      {todos.map(todo => (
        <div
          className={classNames(
            'todo',
            {
              completed: todo.completed,
            },
          )}
          key={todo.id}
        >
          <label
            className="todo__status-label"
          >
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              if (todo.id) {
                removeTodo(`${todo.id}`)
                  .then(() => setTodoWasDeleted(true))
                  .catch((fetchedError) => {
                    setError(
                      fetchedError?.message
                        ? fetchedError.message
                        : 'Something went wrong',
                    );
                  });
              }
            }}
          >
            ×
          </button>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
