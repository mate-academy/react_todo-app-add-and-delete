import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  showError: (text: string) => void;
}

export const TodoList: React.FC<Props> = ({ todos, deleteTodo, showError }) => {
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
        {todos.map((todo) => (
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
                <div className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              ) : '×'}
            </button>
          </div>
        ))}
      </section>

      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          {error}
        </div>
      )}
    </>
  );
};
