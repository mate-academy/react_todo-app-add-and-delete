import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { Errors } from '../../types/Error';
/* eslint-disable max-len */
interface Props {
  displayTodos: Todo[],
  temptodo?: Todo | null,
  setTodos: (value: Todo[]) => void,
  todos: Todo[],
  setError: (value: string) => void
  setloader: (value: boolean | number) => void
  loader: boolean | number
}

export const Todolist: React.FC<Props> = ({
  displayTodos,
  temptodo,
  setTodos,
  todos,
  setError,
  setloader,
  loader,
}) => {
  // const [loader, setloader] = useState<boolean | number>(false);

  const handleDelete = (id: number | undefined) => {
    if (id) {
      setloader(id);
      deleteTodos(id)
        .then(() => {
          setTodos(todos.filter(todo => todo.id !== id));
        })
        .catch(() => setError(Errors.unableDelete))
        .finally(() => setloader(false));
    }
  };

  return (

    <section className="todoapp__main" data-cy="TodoList">
      {displayTodos.map(todo => {
        return (
          <div
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
            key={todo.id}
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
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', { 'is-active': loader === todo.id || (loader && todo.completed) })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

        );
      })}

      {temptodo && (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: temptodo?.completed })}
          key={temptodo?.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={temptodo?.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {temptodo?.title.trim()}
          </span>

          {/* Remove button appears only on hover */}
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
