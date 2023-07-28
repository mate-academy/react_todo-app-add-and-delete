import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from '../context/todosContext';
import { deleteTodo } from '../api/todos';

interface Props {
  todo: Todo;
}

export const TodoItem:React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    tempTodo,
    onDeleteTodo,
    setErrorMessage,
    deletingCompletedTodo,
  } = useContext(TodosContext);

  const onTodoDelete = (todoId: number) => {
    setLoading(true);

    deleteTodo(todoId)
      .then(() => {
        onDeleteTodo(todoId);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const isLoading = (deletingCompletedTodo && todo.completed)
      || todo.id === 0;

    setLoading(isLoading);
  }, [deletingCompletedTodo, tempTodo]);

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onTodoDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {loading && (
        <div
          className={cn('modal overlay', {
            'is-active': loading,
          })}
        >
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
