import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo,
  setTodosList: React.Dispatch<React.SetStateAction<Todo[]>>,
  setDeleteError: React.Dispatch<React.SetStateAction<boolean>>,
  deleteAll: boolean,
};

export const TodoCard: React.FC<Props> = ({
  todo,
  setTodosList,
  setDeleteError,
  deleteAll,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (deleteAll) {
      setIsDeleted(true);
    }
  }, []);

  const handlerDeleteTodo = async (todoId: number) => {
    setIsDeleted(true);
    try {
      await deleteTodo(todoId);

      setTodosList(currentList => currentList
        .filter(deletedTodo => deletedTodo.id !== id));
    } catch {
      setDeleteError(true);
      setTimeout(() => {
        setDeleteError(false);
      }, 3000);
    }

    setIsDeleted(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handlerDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': (deleteAll && todo.completed) || isDeleted,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
