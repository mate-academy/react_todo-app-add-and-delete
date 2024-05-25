import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import { useTodosContext } from '../context/TodosContext';

import { updateTodo } from '../api/todos';

import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  deletingTodo?: (id: number) => void;
};

export const TodoItem: React.FunctionComponent<TodoItemProps> = ({
  todo,
  deletingTodo,
}) => {
  const { setTodos, setErrorMessage, setLoadingIds, loadingIds } =
    useTodosContext();
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputFocusRef = useRef<HTMLInputElement>(null);

  function updatingTodo(updatedTodo: Todo) {
    setLoadingIds(prev => [...prev, updatedTodo.id]);

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todoForUpdate =>
            todoForUpdate.id === updatedTodo.id ? updatedTodo : todoForUpdate,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== updatedTodo.id));
      });
  }

  function updatingAndDeleteting() {
    const normalizedEditedTitle = editedTitle.trim();
    const updatedTodo = { ...todo, title: normalizedEditedTitle };

    if (!updatedTodo.title) {
      deletingTodo?.(todo.id);

      return;
    }

    updatingTodo(updatedTodo);
    setEditing(false);
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updatingAndDeleteting();
  };

  const handleDeleteTodo = (todoId: number) => {
    deletingTodo?.(todoId);
  };

  const handleOnBlur = () => {
    updatingAndDeleteting();
  };

  const handleToggleTodoStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    updatingTodo(updatedTodo);
  };

  useEffect(() => {
    if (editing && inputFocusRef.current) {
      inputFocusRef.current.focus();
    }
  }, [editing]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodoStatus}
        />
      </label>

      {editing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={inputFocusRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => {
              setEditedTitle(e.target.value);
            }}
            onBlur={handleOnBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo?.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
