/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from '../TodosContext';
import { deleteTodo, updateTodo } from '../api/todos';
import { EditForm } from './EditForm';

interface Props {
  todo: Todo;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const { setTodos, setErrorMessage } = useContext(TodosContext);
  const [loading, setLoading] = useState(isLoading);
  const [editMode, setEditMode] = useState(false);

  const { id, title, completed } = todo;

  const handleDeleteTodo = (todoId: number) => {
    setLoading(true);

    deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(t => t.id !== todoId)))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setLoading(false));
  };

  const handleUpdateTodo = (editingCompleted: boolean) => {
    setLoading(true);

    updateTodo({ id, completed: editingCompleted, title })
      .then((updatedTodo: Todo) => {
        setTodos(prev =>
          prev.map(t => {
            if (t.id === updatedTodo.id) {
              return updatedTodo;
            }

            return t;
          }),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoading(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        // eslint-disable-next-line quote-props
        { completed: completed },
      )}
      onDoubleClick={() => {
        setEditMode(true);
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodo(!completed)}
        />
      </label>

      {!editMode ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDeleteTodo(id);
            }}
          >
            ×
          </button>
        </>
      ) : (
        <EditForm
          todo={todo}
          onEditMode={setEditMode}
          setLoading={setLoading}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
