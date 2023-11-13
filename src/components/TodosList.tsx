import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/TodosFilter';
import { useState } from 'react';

type Props = {
  currentTodos: Todo[];
  filter: TodosFilter;
  setCurrentTodos: (updatedTodos: Todo[]) => void;
  updatingTodo: boolean;
  newTodo: string;
};

export const TodoList: React.FC<Props> = ({
  currentTodos,
  filter,
  setCurrentTodos,
  updatingTodo,
  newTodo,
}) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const filteredTodos = () => {
    switch (filter) {
      case TodosFilter.all:
        return currentTodos;
      case TodosFilter.completed:
        return currentTodos.filter((todo) => todo.completed);
      case TodosFilter.active:
        return currentTodos.filter((todo) => !todo.completed);
      default:
        return currentTodos;
    }
  };

  const handleDeleteCurrentTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    setTimeout(() => {
      const updatedTodos = currentTodos.filter((todo) => todo.id !== todoId);
      setCurrentTodos(updatedTodos);
      setDeletingTodoId(null);
    }, 300);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos().map((todo) => (
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
            onClick={() => handleDeleteCurrentTodo(todo.id)}
          >
            ×
          </button>
          {deletingTodoId === todo.id && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
      {updatingTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {newTodo}
          </span>
          {/* Remove button appears only on hover */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
      {/* Additional components for overlays and editing */}
    </section>
  );
};
