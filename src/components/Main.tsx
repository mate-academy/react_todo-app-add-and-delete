/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';

type Props = {
  filteredTodos: Todo[];
  toggleTodoCompletion: (todoId: number) => void;
  deleteTodos: (todoId: number) => void;
  isLoadingTodo: number[];
  tempTodo: Todo | null;
};

export const Main: React.FC<Props> = ({
  filteredTodos,
  toggleTodoCompletion,
  isLoadingTodo,
  deleteTodos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''}`}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodoCompletion(todo.id)}
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
            onClick={() => deleteTodos(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={`modal overlay ${isLoadingTodo.includes(todo.id) ? 'is-active' : 'hidden'}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && ( // Рендерити tempTodo, якщо він існує
        <TempTodo
          todo={tempTodo}
          deleteTodos={deleteTodos}
        />
      )}
    </section>
  );
}
