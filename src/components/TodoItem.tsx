import cn from 'classnames';

import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import { TodoEditing } from './TodoEditing';
import { deleteTodo } from '../api/todos';
import { TodoContext } from '../providers/TodoProvider';
import { TodoError } from '../types/TodoError';

export const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const { id, title, completed } = todo;
  const [isEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { todos, setTodos, setError } = useContext(TodoContext);

  const handleTodoDelete = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        const editedArray = todos.filter(task => task.id !== todoId);

        setTodos(editedArray);
      })
      .catch(() => setError(TodoError.Delete))
      .finally(() => {
        setIsLoading(false);

        setTimeout(() => {
          setError(TodoError.Null);
        }, 3000);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        [TodoStatus.Editing]: isEditing,
        [TodoStatus.Completed]: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>

      {isEditing
        ? <TodoEditing />
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleTodoDelete(id)}
            >
              ×
            </button>

          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading || id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
