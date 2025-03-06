import { Todo } from '../../types/Todo';
import { updateTodoStatus, deleteTodo } from '../../api/todos';

type Prop = {
  filteredTodos: Todo[] | undefined;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setActionError: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo|null;
  loadingId: number;
  setLoadingId: React.Dispatch<React.SetStateAction<number>>;
};

export const TodoList: React.FC<Prop> = ({
  filteredTodos,
  setActionError,
  setTodos,
  tempTodo,
  loadingId,
  setLoadingId,
}) => {
  const markTodoComplete = (updateTodo: Todo) => {
    updateTodoStatus(updateTodo)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setActionError('update');
      })
      .finally(() => {
        setLoadingId(0);
      });
    setLoadingId(0);
    setTimeout(() => {
      setActionError('');
    }, 3000);
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setActionError('delete');
      })
      .finally(() => {
        setLoadingId(0);
      });
    setLoadingId(0);
    setTimeout(() => {
      setActionError('');
    }, 3000);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={todo.completed ? 'todo completed' : 'todo'}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              aria-label="Mark as completed"
              onChange={() => {
                markTodoComplete(todo);
                setLoadingId(todo.id);
              }}
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
            onClick={() => {
              handleDeleteTodo(todo.id);
              setLoadingId(todo.id);
            }}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${loadingId === todo.id ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          data-cy="Todo"
          key={tempTodo.id}
          className={tempTodo.completed ? 'todo completed' : 'todo'}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              aria-label="Mark as completed"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
