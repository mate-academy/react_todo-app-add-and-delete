import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';

type Props = {
  item: Todo,
};

export const TodoItem: React.FC<Props> = ({ item }) => {
  const {
    setTodos,
    setErrorMessage,
    setErrorWithTimeout,
  } = useContext(TodosContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteButton = (todoId: string) => {
    setIsDeleting(true);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== +todoId));
      })
      .catch(() => {
        setErrorWithTimeout(ErrorMessage.Deleting, setErrorMessage);
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: item.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={item.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {item.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteButton(item.id.toString())}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isDeleting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
