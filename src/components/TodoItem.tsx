/* eslint-disable jsx-a11y/label-has-associated-control */
import { deleteTodo, ErrorMessagesNotification } from '../api/todos';
import classNames from 'classnames';
import { Todo } from './TodoList';
import { useState } from 'react';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setError: (error: ErrorMessagesNotification | null) => void;
};

const TodoItem = ({ todo, setTodos, inputRef, setError }: Props) => {
  const [isDeleting, setDelete] = useState(false);
  const handleDelete = async () => {
    setDelete(true);
    try {
      await deleteTodo(todo.id);

      setTodos(current =>
        current.filter(deletedTodo => {
          return deletedTodo.id !== todo.id;
        }),
      );
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      setError(ErrorMessagesNotification.DELETE);
      setDelete(false);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos => {
      return prevTodos.map(t => {
        return t.id === id ? { ...t, completed: !t.completed } : t;
      });
    });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      // eslint-disable-next-line react/jsx-no-comment-textnodes
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.loading || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
