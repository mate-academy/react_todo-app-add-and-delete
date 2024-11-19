/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';

interface TodoProps {
  todo: Todo;
  handleUpdateTodoStatus: (todoId: number) => void;
  setSelectedTodo(todo: Todo): void;
  handleEditTodoTitle: (
    e: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => void;
  handleRemoveTodo: (todoId: number) => void;
  editingTodosId: number[];
  selectedTodo: Todo | null;
  TodoTitleFieldRef: React.RefObject<HTMLInputElement>;
  handleSelectedTodoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TodoComponent({
  editingTodosId,
  handleEditTodoTitle,
  handleRemoveTodo,
  handleUpdateTodoStatus,
  setSelectedTodo,
  todo,
  selectedTodo,
  TodoTitleFieldRef,
  handleSelectedTodoChange,
}: TodoProps) {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleUpdateTodoStatus(todo.id)}
        />
      </label>
      {!selectedTodo || selectedTodo.id !== todo.id ? (
        <span
          onDoubleClick={() => setSelectedTodo(todo)}
          data-cy="TodoTitle"
          className="todo__title"
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={e => handleEditTodoTitle(e, todo)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={TodoTitleFieldRef}
            className="todo__title-field"
            onChange={handleSelectedTodoChange}
            placeholder="Empty todo will be deleted"
            onBlur={e =>
              handleEditTodoTitle(
                e as unknown as React.FormEvent<HTMLFormElement>,
                todo,
              )
            }
            value={selectedTodo?.title}
          />
        </form>
      )}

      {/* Remove button appears only on hover */}
      {!selectedTodo || selectedTodo.id !== todo.id ? (
        <button
          onClick={() => handleRemoveTodo(todo.id)}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>
      ) : null}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${editingTodosId.includes(todo.id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
