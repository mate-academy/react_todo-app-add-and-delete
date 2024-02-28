import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../TodosContext/TodosContext';

type Props = {
  title: string;
  id: number;
  completed: boolean;
  setErrorMessage?: (message: string) => void;
  showErrorCallback?: () => void;
};

export const TodoItem: React.FC<Props> = ({
  title,
  id,
  completed,
  setErrorMessage,
  showErrorCallback,
}) => {
  const [TodoLoader, setTodoLoader] = useState(false);
  const { todos, setTodos } = useContext(TodosContext);

  const handleDeleteTodo = (todoId: number) => {
    setTodoLoader(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage?.('Unable to delete a todo');
        showErrorCallback?.();
      })
      .finally(() => {
        setTodoLoader(false);
      });
  };

  return (
    <li
      key={id}
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': id === 0 || TodoLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
