import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  todos: Todo[],
  onSetTodos: (todos: Todo[]) => void,
  onSetError: (message: string) => void,
};
export const TodoInfo: React.FC<Props> = ({
  todo,
  onSetTodos,
  todos,
  onSetError,
}) => {
  const [isEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isDeleted, setIsDeleted] = useState(false);

  const deleteTodo = async () => {
    setIsLoading(true);
    const filteredTodos = todos.filter(({ id }) => id !== todo.id);

    try {
      await removeTodo(todo.id);
      onSetTodos(filteredTodos);
    } catch {
      onSetError('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!todo.title) {
      deleteTodo();
    }
  }, []);

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
