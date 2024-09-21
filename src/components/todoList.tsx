/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../types/Todo';
interface TodoListProps {
  filteredTodos: Todo[];
  updateTodoStatus: (todoId: number, completed: boolean) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  updateTodoStatus,
  deleteTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''}`}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => updateTodoStatus(todo.id, !todo.completed)}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${loadingTodoId === todo.id ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
