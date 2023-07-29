import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo,
  todos?: Todo[],
  onTodosChange?: (todos: Todo[]) => void;
  loadingTempTodo?: boolean,
  onErrorChange?: (error: Error) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos = [],
  onTodosChange = () => { },
  loadingTempTodo,
  onErrorChange = () => { },
}) => {
  const [loading, setLoading] = useState(false);

  const removeTodo = (todoId: number) => {
    setLoading(true);

    deleteTodo(todoId)
      .then(() => {
        onTodosChange(todos.filter(({ id }) => id !== todoId));
      })
      .catch(() => {
        onErrorChange(Error.Delete);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={cn('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(todo.id)}
      >
        x
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': loadingTempTodo || loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
