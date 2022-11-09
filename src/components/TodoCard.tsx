import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { ErrorsType } from '../types/ErrorsType';

type Props = {
  todo: Todo,
  getTodosList: () => Promise<void>,
  setErrors: React.Dispatch<React.SetStateAction<ErrorsType[]>>,
  isLoadingTodos: number[],
  setIsLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>,
};

export const TodoCard: React.FC<Props> = ({
  todo,
  getTodosList,
  setErrors,
  isLoadingTodos,
  setIsLoadingTodos,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  const handlerDeleteTodo = async (todoId: number) => {
    setIsLoadingTodos(currentLoadTodos => [
      ...currentLoadTodos,
      todoId,
    ]);

    try {
      await deleteTodo(todoId);

      await getTodosList();
    } catch {
      setErrors(currErrors => [
        ...currErrors,
        ErrorsType.Delete,
      ]);
      setTimeout(() => {
        setErrors(currErrors => currErrors
          .filter(error => error !== ErrorsType.Delete));
      }, 3000);
    }

    setIsLoadingTodos(currentLoadTodos => currentLoadTodos
      .filter(stillLoadId => stillLoadId !== todoId));
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
            'is-active': isLoadingTodos.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
