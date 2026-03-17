import React from 'react';
import { deleteTodo, patchTodo } from '../../api/todos';
import { Todo } from '../../types';
import { ErrorType } from '../../types';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  processingId: number | null;
  setProcessingId: React.Dispatch<React.SetStateAction<number | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setError,
  processingId,
  setProcessingId,
  inputRef,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label={`Mark ${todo.title} as completed`}
          onChange={() => {
            setProcessingId(todo.id);

            patchTodo(todo.id, { completed: !todo.completed })
              .then(updatedTodo => {
                setTodos(prev =>
                  prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
                );
              })
              .catch(() => setError('update'))
              .finally(() => setProcessingId(null));
          }}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setProcessingId(todo.id);

          deleteTodo(todo.id)
            .then(() => {
              setTodos(prev => prev.filter(t => t.id !== todo.id));
              inputRef.current?.focus();
            })
            .catch(() => {
              setError('delete');
            })
            .finally(() => setProcessingId(null));
        }}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          processingId === todo.id ? 'is-active' : 'hidden'
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
