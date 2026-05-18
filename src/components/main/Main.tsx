import { Todo } from '../../types/Todo';

export const Main = ({
  filteredTodos,
  deleteTodo,
  deletingTodoIds,
  tempTodo,
}: {
  filteredTodos: Todo[];
  deleteTodo: (id: number) => void;
  deletingTodoIds: number[];
  tempTodo: Todo | null;
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={todo.completed ? 'todo completed' : 'todo'}
        >
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${todo.id}`}
          >
            <input
              id={`todo-status-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
            <span className="is-hidden">Todo status</span>
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
            className={`modal overlay ${deletingTodoIds.includes(todo.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor="todo-status-temp">
            <input
              id="todo-status-temp"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={() => {}}
            />
            <span className="is-hidden">Todo status</span>
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
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
