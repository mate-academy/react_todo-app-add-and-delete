import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorList } from '../types/ErrorList';
import { useTodosContext } from '../context/TodoContext';

interface Props {
  todo: Todo;
  focusInput: () => void;
}

export const TodoItem: React.FC<Props> = ({ todo, focusInput }) => {
  const { setTodos, preparedTodos, handleError } = useTodosContext();
  const [deleteID, setDeleteID] = useState<number | null>(null);

  const hendlerDestroyOne = (ItemId: number) => {
    const visibleTodos = [...preparedTodos];

    setDeleteID(ItemId);

    deleteTodo(ItemId)
      .then(() => {
        setTodos(visibleTodos.filter(values => values.id !== ItemId));
      })
      .catch(() => {
        handleError(ErrorList.DeleteTodo);
      })
      .finally(() => {
        focusInput();
      });
  };

  const handleChecker = (ItemID: number) => {
    setTodos(
      preparedTodos.map(prevItem => {
        if (prevItem.id === ItemID) {
          return {
            ...prevItem,
            completed: !prevItem.completed,
          };
        }

        return prevItem;
      }),
    );
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label aria-label="Todo status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChecker(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => hendlerDestroyOne(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deleteID === todo.id || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
