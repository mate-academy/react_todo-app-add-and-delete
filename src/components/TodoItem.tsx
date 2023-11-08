import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { ErrorTitle } from '../types/TodoErrors';

type Props = {
  todo: Todo;
  setToodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage(val: string): void;
  setIsSubmitting(val: boolean): void;
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
  loader: Record<number, boolean>;
  fakeTodoActive?: boolean | undefined;
};

const TodoItem: React.FC<Props> = ({
  todo,
  setToodos,
  setErrorMessage,
  setIsSubmitting,
  setLoader,
  loader,
  fakeTodoActive,
}) => {
  function handlerDeleteTodo(todoId: number) {
    setLoader((prevLoader) => ({
      ...prevLoader,
      [todoId]: true,
    }));
    setIsSubmitting(true);
    deleteTodo(todoId)
      .then(() => {
        setToodos((currentTodos) => {
          const updatedTodos = currentTodos.filter(
            (currentTodo) => currentTodo.id !== todoId,
          );

          return updatedTodos;
        });
      })
      .catch(() => setErrorMessage(ErrorTitle.Delete))
      .finally(() => {
        setIsSubmitting(false);
        setLoader((prevLoader) => ({
          ...prevLoader,
          [todoId]: false,
        }));
      });
  }

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
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        onClick={() => handlerDeleteTodo(todo.id)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loader[todo.id] || fakeTodoActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
