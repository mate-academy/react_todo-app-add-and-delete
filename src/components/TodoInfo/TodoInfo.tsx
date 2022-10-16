import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  setError: (error: string) => void,
  setDeleted: (prevState: any) => void,
  todo: Todo,
};

export const TodoInfo: React.FC<Props> = ({ setError, setDeleted, todo }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteTodo = async () => {
    setIsDeleting(true);
    try {
      await deleteTodo(todo.id);
      setDeleted((prev: number[]) => [...prev, todo.id]);
    } catch (e) {
      setError('delete');
    }

    setIsDeleting(false);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
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
        data-cy="TodoDeleteButton"
        onClick={onDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
