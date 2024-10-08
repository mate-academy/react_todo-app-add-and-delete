import { updateTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';

import cn from 'classnames';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isLoading?: boolean;
  handleDeleteTodo: (id: number) => void;
  isDeleting?: boolean;
  setloadingIds: (
    loading: number[] | ((prevLoading: number[]) => number[]),
  ) => void;
  loadingIds: number[];
  setErrorMessage: (string: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  isLoading,
  handleDeleteTodo,
  isDeleting,
  setloadingIds,
  loadingIds,
  setErrorMessage,
}) => {
  function toggleCompleteTodo() {
    setloadingIds(prevIds => [...prevIds, todo.id]);

    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodos(updatedTodo)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(todoItem =>
            todoItem.id === todo.id ? updatedTodo : todoItem,
          ),
        );
      })
      .catch(() => setErrorMessage('CHANGE'))
      .finally(() => {
        setloadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleCompleteTodo}
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
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || isDeleting || loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
