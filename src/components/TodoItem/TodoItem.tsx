import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void;
  isLoading: boolean | number;
  setIsLoading: (value: boolean | number) => void;
  setTodosError: (error: ErrorMessage) => void;
  tempTodos: Todo | null,
};

export const TodoItem: React.FC<Props> = ({
  todos,
  setTodos,
  isLoading,
  setIsLoading,
  setTodosError,
  tempTodos,
}) => {
  const deleteTodoHandler = async (todoId: number) => {
    try {
      await setIsLoading(true);

      deleteTodos(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setTimeout(() => {
        setTodosError(ErrorMessage.UnableToDeleteTodo);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={cn('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              readOnly
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
            onClick={() => deleteTodoHandler(todo.id)}
          >
            x
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div
            data-cy="TodoLoader"
            className={cn(
              'modal overlay',
              { 'is-active': isLoading || todo.id === 0 },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodos && (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: tempTodos.completed })}
          key={tempTodos.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodos.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodos.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay is-active')}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
