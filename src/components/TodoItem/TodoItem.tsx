import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../context/TodosContext';
import { deleteTodo } from '../../api/todos';

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
      await deleteTodo(todoId);

      handleDeleteTodo(todoId);
    } catch {
      handleSetError('Unable to delete a todo');
    } finally {
      dispatch({ type: 'loading', payload: false });
      setCurrentId(null);
    }
  };

  // prettier-ignore
  const isItemDeleting = (isLoading && todo.id === currentId)
    || (isDeletingAllCompleted && todo.completed);

  return (
    <div
      data-cy="Todo"
      className={cn('todo ', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" aria-label="Check todo">
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
