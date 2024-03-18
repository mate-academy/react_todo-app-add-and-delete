import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../context/TodosContext';
import { deleteTodos } from '../../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    handleDeleteTodo,
    handleSetError,
    isLoading,
    dispatch,
    isDeletingAllCompleted,
  } = useTodos();
  const [currentId, setCurrentId] = useState<number | null>(null);
  const handleDeletingTodo = async (todoId: number) => {
    dispatch({ type: 'loading', payload: true });
    setCurrentId(todoId);
    try {
      await deleteTodos(todoId);

      handleDeleteTodo(todoId);
    } catch {
      handleSetError('Unable to delete a todo');
    } finally {
      dispatch({ type: 'loading', payload: false });
      setCurrentId(null);
    }
  };

  // Cant't Fix because of prettier
  /* eslint-disable */
  const isItemDeleting =
    (isLoading && todo.id === currentId) ||
    (isDeletingAllCompleted && todo.completed);
  /* eslint-disable */

  return (
    <div
      data-cy="Todo"
      className={cn('todo ', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        onClick={() => handleDeletingTodo(todo.id)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isItemDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
