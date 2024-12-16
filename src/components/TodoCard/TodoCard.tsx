import React from 'react';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/Errors';
interface Props {
  title: string;
  isCompleted: boolean;
  isTempTodo: boolean;
  isDeleting: boolean;
  todoId: number;
  setIsDeleting: (isDeleting: boolean) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (hasError: Errors) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}
/* eslint-disable jsx-a11y/label-has-associated-control */
export const TodoCard: React.FC<Props> = props => {
  const {
    title,
    isCompleted,
    isTempTodo,
    isDeleting,
    todoId,
    setIsDeleting,
    todos,
    setTodos,
    setHasError,
    inputRef,
  } = props;

  const [deletingCardId, setDeletingCardId] = React.useState<number | null>();

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeletingCardId(todoId);
    try {
      await deleteTodo(todoId);

      setIsDeleting(false);
      setDeletingCardId(null);
      setTodos(todos.filter(todo => todo.id !== todoId));
      inputRef.current?.focus();
    } catch {
      setHasError(Errors.UnableToDelete);
      setIsDeleting(false);
      setDeletingCardId(null);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: isCompleted })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTempTodo || (isDeleting && deletingCardId === todoId),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
