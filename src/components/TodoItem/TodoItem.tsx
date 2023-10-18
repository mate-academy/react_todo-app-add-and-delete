import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setErrorMessage,
}) => {
  const [editing, setEditing] = useState(false);
  const [currentIdToDelete, setCurrentIdToDelete]
  = useState<number | null>(null);

  function getTodoById(todoId: number): Todo | null {
    return todos.find((item: Todo) => item.id === todoId) || null;
  }

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setCurrentIdToDelete(todoId);

    deleteTodo(todoId)
      .then(() => {
        const todoToUpdate = getTodoById(todoId);

        if (todoToUpdate) {
          setTodos(todos.filter(obj => obj !== todoToUpdate));
        }
      })
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setCurrentIdToDelete(null);
      });
  };

  return (
    <div
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
          onChange={() => {}}
        />
      </label>

      {!editing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${currentIdToDelete === todo.id && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
