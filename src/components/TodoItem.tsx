import cn from 'classnames';
import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/Error';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, setError } = useTodoContext();
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);

  const handleTodoDelete = async () => {
    setIsTodoDeleting(true);

    try {
      await deleteTodo(todo.id);

      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    } catch {
      setError(TodoError.DELETE);
    } finally {
      setIsTodoDeleting(false);
    }
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': isTodoDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
