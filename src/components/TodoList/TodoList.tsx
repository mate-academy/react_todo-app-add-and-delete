/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ErrorMessages, Todo } from '../../types';
import cn from 'classnames';
import * as React from 'react';
import { useDeleteTodos } from '../../hooks/useDeleteTodo';

type Props = {
  filteredTodos: Todo[];
  todoIdLoading: number[];
  inputRef: React.RefObject<HTMLInputElement>;

  onCheckTodo: (id: number) => void;
  onSetTodoIdLoading: React.Dispatch<React.SetStateAction<number[]>>;
  onSetError: (error: ErrorMessages) => void;
  onSetPreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  todoIdLoading,
  inputRef,

  onCheckTodo,
  onSetTodoIdLoading,
  onSetError,
  onSetPreparedTodos,
}) => {
  const { handleDeleteTodos } = useDeleteTodos({
    filteredTodos,
    inputRef,

    onSetPreparedTodos,
    onSetError,
    onSetTodoIdLoading,
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => onCheckTodo(todo.id)}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodos(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': todoIdLoading.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
