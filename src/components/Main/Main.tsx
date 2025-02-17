/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  setTodos: (todos: Todo[]) => void;
  loadingIds: number[];
  setLoadingIds: Dispatch<SetStateAction<number[]>>;
};

export const Main: React.FC<Props> = ({
  todos,
  deleteTodo,
  setTodos,
  loadingIds,
  setLoadingIds,
}) => {
  const onToggleStatus = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleDelete = (todoId: number) => {
    setLoadingIds(prevIds => [...prevIds, todoId]);

    return deleteTodo(todoId).finally(() => setLoadingIds([]));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
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
              onClick={() => onToggleStatus(todo.id)}
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': loadingIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
