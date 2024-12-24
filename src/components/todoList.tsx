import classNames from 'classnames';
import { TypeTodoList } from '../types/Todo';

export const TodoList: React.FC<TypeTodoList> = ({
  filteredTodoList,
  deletingTodos,
  handleToggleCompletion,
  handleDeleteTodo,
}) => {
  return (
    <>
      {filteredTodoList.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: completed,
              'todo--loading': deletingTodos.includes(id),
            })}
            key={todo.id}
          >
            {/* eslint-disable-next-line */}
            <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                id={`todo-status-${todo.id}`}
                onChange={() => handleToggleCompletion(id)}
                disabled={deletingTodos.includes(id)}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
              disabled={deletingTodos.includes(id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': deletingTodos.includes(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </>
  );
};
