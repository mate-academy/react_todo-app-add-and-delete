/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { updateTodos } from '../api/todos';
import cn from 'classnames';
import { deleteTodos } from '../api/todos';
import { ErrorType } from '../types/Error';

type Props = {
  todo: Todo;
  setUpdateTodoStatus: (id: number, status: boolean) => void;
  isTemp?: boolean;
  setError: (value: ErrorType, time?: number) => void;
  setDeleteItemFromTodos: (id: number) => void;
  loading: number[];
  setLoading: Dispatch<SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setUpdateTodoStatus,
  isTemp,
  setError,
  setDeleteItemFromTodos,
  loading,
  setLoading,
}) => {
  const settingStatus = async (id: number, newStatus: boolean) => {
    try {
      await updateTodos(id, { completed: newStatus });
      setUpdateTodoStatus(id, newStatus);
    } catch (e) {
      setError(ErrorType.update_error, 3000);
    }
  };

  const onDeleteBtnHandler = async (id: number) => {
    try {
      setLoading((prev: number[]) => [...prev, id]);
      await deleteTodos(id);
      setDeleteItemFromTodos(id);
    } catch {
      setError(ErrorType.delete_error, 3000);
    } finally {
      setLoading(prev => prev.filter(todoId => todoId !== id));
    }
  };

  return (
    <div
      key={todo.id}
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
          checked={todo.completed}
          onChange={() => {
            settingStatus(todo.id, !todo.completed);
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteBtnHandler(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTemp || loading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
