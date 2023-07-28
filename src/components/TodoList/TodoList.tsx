import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  showError: (text: string) => void;
  isLoadingTodos: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  showError,
  isLoadingTodos,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  let timeoutId: NodeJS.Timeout;

  const handleDeleteTodo = async (todoId: number) => {
    setIsLoading(true);
    try {
      await deleteTodo(todoId);
    } catch (deleteError) {
      showError('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [error]);

  return (
    <>
      <section className="todoapp__main">
        {isLoadingTodos ? (
          <div className="loader" />
        ) : (
          todos.map((todo) => (
            <div
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                {isLoading ? (
                  <div className="loader" />
                ) : '×'}
              </button>
            </div>
          ))
        )}
      </section>

      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          {error}
        </div>
      )}
    </>
  );
};
