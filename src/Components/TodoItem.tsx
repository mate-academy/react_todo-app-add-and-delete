/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { useState } from 'react';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  completedTodoIds: number[];
  completedClearing: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  inputRef,
  completedClearing,
  completedTodoIds,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTodoDelete = (id: number) => {
    setIsDeleting(true);
    deleteTodo(id)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(prevTodo => prevTodo.id !== id),
        );
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div
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
          'is-active':
            todo.id === 0 ||
            isDeleting ||
            (completedClearing && completedTodoIds.includes(todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
