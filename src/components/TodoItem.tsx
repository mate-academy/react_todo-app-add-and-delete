import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;
  const [isLoading, setIsLoading] = useState(false);

  const todosContext = useContext(TodosContext);

  if (!todosContext) {
    return null;
  }

  const { removeTodo } = todosContext;

  function handleDeleteTodo(todoId: number) {
    setIsLoading(true);
    removeTodo(todoId);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className={cn('todo', { completed })}>
      <div className={cn('modal overlay', { 'is-active': isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => {}}
        />
      </label>

      {false && (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>
    </div>
  );
};
