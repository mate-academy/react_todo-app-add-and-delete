import React, { useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { TodosContext, USER_ID } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    setTodos,
    handleSetError,
    setTempUpdating,
    tempUpdating,
  } = useContext(TodosContext);

  const { id, title, completed } = todo;

  const handleDeleteTodo = async () => {
    handleSetError(ErrorMessage.NOT_ERROR);

    try {
      setTempUpdating(prev => [...prev, id]);

      await deleteTodo(USER_ID, id);

      setTodos(todos.filter(currTodo => currTodo.id !== id));
    } catch {
      handleSetError(ErrorMessage.ON_DELETE);
    } finally {
      setTempUpdating([0]);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': tempUpdating.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
