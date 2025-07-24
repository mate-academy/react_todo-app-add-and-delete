import React from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos, patchTodo } from '../api/todos';

interface Props {
  filteredTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadingTodoId: number | null;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  loadingTodoIds: number[];
  setIsError: React.Dispatch<React.SetStateAction<string | null>>;
  hideErrorMessage: () => void;
}

export const MainSection: React.FC<Props> = ({
  filteredTodos,
  setTodos,
  setIsLoading,
  setLoadingTodoId,
  setLoadingTodoIds,
  loadingTodoIds,
  setIsError,
  hideErrorMessage,
}) => {
  const deleteButton = (id: number) => {
    setIsLoading(true);
    setLoadingTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(todo => todo.id !== id),
        );
      })
      .catch(() => {
        setIsError('Unable to delete a todo');
        hideErrorMessage();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggleTodo = (id: number, completed: boolean) => {
    setLoadingTodoIds(prev => [...prev, id]);
    setIsLoading(true);
    setLoadingTodoId(id);
    patchTodo(id, !completed)
      .then(updatedTodo => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
        getTodos().then(setTodos);
      })
      .catch(() => {
        setIsError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoIds(prev => prev.filter(prevId => prevId !== id));
      });
  };

  const [hover, setHover] = React.useState<boolean>(false);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <form
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          data-cy="Todo"
          key={todo.id}
          className={`todo ${todo.completed ? 'completed' : 'active'}`}
        >
          <label className="todo__status-label">
            {/* можна додати іконку статусу тут, якщо треба */}
            <input
              id={`todo-${todo.id}`}
              onClick={() => toggleTodo(todo.id, todo.completed)}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className={`todo__remove ${!hover ? 'hidden' : ''}`}
            data-cy="TodoDelete"
            onClick={() => {
              deleteButton(todo.id);
            }}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${loadingTodoIds && loadingTodoIds.includes(todo.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </form>
      ))}
    </section>
  );
};
