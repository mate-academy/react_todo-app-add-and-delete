import React, { useContext, useState } from 'react';
import cn from 'classnames';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../../types/TempTodo';
import { TodoContext } from '../../context/TodoContext';
import { Errors } from '../../types/Errors';

type Props = {
  todo: Todo | TempTodo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, setErrorMessage } = useContext(TodoContext);

  const [isLoading, setIsLoading] = useState(false);

  const deleteTodoItem = async (todoId: number) => {
    setIsLoading(true);

    todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos((prev) => prev.filter((t) => t.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(Errors.DeleteError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodoItem(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': todo.id === 0 || isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
