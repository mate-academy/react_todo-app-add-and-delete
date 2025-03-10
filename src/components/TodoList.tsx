/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  isLoading: boolean;
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => Promise<void>;
  loadingTodos: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isLoading,
  handleToggle,
  handleDelete,
  loadingTodos,
  tempTodo,
}) => {
  if (filteredTodos.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          loadingTodos={loadingTodos}
        />
      ))}

      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className={`todo ${tempTodo.completed ? 'completed' : ''}`}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              disabled
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
