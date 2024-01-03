import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { useTodoContext } from '../context';

type Props = {
  todo: Todo;
};

export const TodoInfo = ({ todo }: Props) => {
  const [isLoading, setIsLoading] = useState<number | boolean>(false);

  const {
    allTodos, setAllTodos, errorHandler, tempTodo,
  } = useTodoContext();

  const handleTodoDelete = (id: number) => {
    setIsLoading(id);

    const deletingTodo = async () => {
      try {
        if (allTodos) {
          await deleteTodo(id);
          const updatedTodo = allTodos.filter(td => td.id !== id);

          setAllTodos(updatedTodo);
        }
      } catch (error) {
        errorHandler('Unable to delete todo');
      } finally {
        setIsLoading(false);
      }
    };

    deletingTodo();
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { 'todo completed': todo.completed })}
    >
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
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === isLoading || todo.id === tempTodo?.id,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
