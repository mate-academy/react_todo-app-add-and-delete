import cn from 'classnames';
import { useState } from 'react';
import { Todo } from './types/Todo';
import { deleteTodo } from './api/todos';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (todo: Todo[]) => void;
  userId: number;
  setErrorMessage: (err: string) => void;
  clearCompleted: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  userId,
  setErrorMessage,
  clearCompleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = () => {
    const updatedTodos
    = todos.map((item) => (item.id === todo.id
      ? { ...item, completed: !item.completed }
      : item));

    setTodos(updatedTodos);
  };

  const handleDelete = () => {
    setLoading(true);
    deleteTodo(userId, todo.id)
      .then(() => {
        const updatedTodos = todos.filter((item) => item.id !== todo.id);

        setTodos(updatedTodos);
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleCheckboxChange}
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
          disabled={loading}
        >
          ×
        </button>
        {(loading || (clearCompleted && todo.completed)) && <TodoLoader />}
      </div>
    </>
  );
};
