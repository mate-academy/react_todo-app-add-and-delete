import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodoListProps = {
  todos: Todo[],
  toggleCompleted: (id: number) => void,
  tempTodo: Todo | null,
  handleRemove: (id: number) => void,
  deletedTodoId: number | null,
};

export const TodoList: React.FC<TodoListProps>
  = ({
    todos, toggleCompleted, tempTodo, handleRemove, deletedTodoId,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo.id)}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleRemove(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': deletedTodoId === todo.id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

        {tempTodo
        && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className="modal overlay is-active"
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>
    );
  };
