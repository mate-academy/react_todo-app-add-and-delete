import { useMemo } from 'react';
import { SortBy, Todo } from '../types';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  sortBy: SortBy,
  handleDeleteTodo: (value: number) => void,
  isLoading: boolean,
  selectedTodo: number[]
};

export const Todos: React.FC<Props> = ({
  todos,
  tempTodo,
  sortBy,
  handleDeleteTodo,
  isLoading,
  selectedTodo,
}) => {
  const filteredTodos = useMemo(() => {
    if (sortBy === SortBy.all) {
      return todos;
    }

    const isCompleted = sortBy === SortBy.completed;

    return todos.filter(({ completed }) => completed === isCompleted);
  }, [sortBy, todos]);

  return (
    <section className="todoapp__main">
      <ul>
        {filteredTodos.map(todo => (
          <li
            className={todo.completed ? 'todo completed' : 'todo'}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            <span className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div
              className={(isLoading && selectedTodo.includes(todo.id))
                ? 'modal overlay is-active'
                : 'modal overlay'}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </li>
        ))}
        {tempTodo && (
          <li
            className="todo"
            key={tempTodo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={false}
              />
            </label>

            <span className="todo__title">
              {tempTodo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(tempTodo.id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div
              className="modal overlay is-active"
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </li>
        )}
      </ul>
    </section>
  );
};
