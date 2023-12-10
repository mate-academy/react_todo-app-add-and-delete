import cn from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from '../TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { removeTodo } from '../api/todos';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    tempTodo,
    setTodos,
    setVisibleTodos,
    setError,
    isClearCompleted,
  } = useContext(TodoContext);

  const [
    deletingTodo,
    setDeletingTodo,
  ] = useState<Todo | undefined>(undefined);

  const handleDelete = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        setTodos(todos.filter(t => t.id !== todoId));
        setVisibleTodos(todos.filter(t => t.id !== todoId));
      })
      .catch(() => setError(ErrorMessage.DeleteTodo))
      .finally(() => setDeletingTodo(undefined));

    setDeletingTodo(todos.find(t => t.id === todoId));
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': todo.id === tempTodo?.id
            || todo.id === deletingTodo?.id
            || (isClearCompleted && todo.completed),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
