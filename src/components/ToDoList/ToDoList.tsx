import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[];
  handleDelete: (todoId: number) => void,
  isLoading: boolean,
  deleting: number,
  tempTodo: Todo | null,
};

export const ToDoList: React.FC<Props> = ({
  visibleTodos,
  handleDelete,
  isLoading,
  deleting,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <div
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

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          <div
            className={`modal overlay ${isLoading && deleting === todo.id && 'is-active'}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div className={tempTodo.completed ? 'todo completed' : 'todo'}>
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
