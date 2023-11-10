import { useContext, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { TodoStatus } from '../enums/TodoStatus';
import { TodoError } from '../enums/TodoError';
import { deleteTodo } from '../api/todos';
import { TodoContext } from '../contexts/TodoContext';
import { TodoEditing } from './TodoEditing';

export const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const { id, title, completed } = todo;
  const [isEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { todos, setTodos, setError } = useContext(TodoContext);

  const handleTodoDelete = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(task => task.id !== todoId));
      })
      .catch(() => {
        setError(TodoError.Delete);

        setTimeout(() => {
          setError(TodoError.Null);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
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
              x
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
