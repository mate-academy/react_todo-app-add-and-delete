import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos:Todo[],
  handleDeleteTodo: (id: number) => void,
  handleUpdate: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleUpdate,
}) => {
  return (
    <ul>
      <li>
        <section className="todoapp__main">

          {todos.map(todo => (
            <div
              key={todo.id}
              className={classNames(
                'todo',
                { completed: todo.completed },
              )}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => {
                    handleUpdate(todo.id);
                  }}
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
                <div
                  className="loader"
                />
              </div>
            </div>
          ))}
        </section>
      </li>
    </ul>
  );
};
