import React, { useContext, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { PageContext } from '../utils/GlobalContext';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    title,
    completed,
  },
}) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const {
    setTodoList,
    todoList,
    setError,
    setIsLoading,
    isLoading,
    DeletedTodos,
  } = useContext(PageContext);

  const handleCompleted = () => {

  };

  const hendleNewTitle = (
    event: React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    setIsLoading(true);
    setNewTitle(event.target.value);
    setIsLoading(false);
  };

  const cancelNewTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
    }
  };

  const deleteCurTodo = () => {
    setIsLoading(true);
    DeletedTodos.push(id);
    deleteTodo(id)
      .then(() => {
        setTodoList(todoList.filter((todo: Todo) => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        DeletedTodos.splice(0);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        { completed },
        'todo',
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={id.toString()}
          checked={completed}
          onChange={handleCompleted}
        />
      </label>
      {editing
        ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={hendleNewTitle}
              onKeyUp={cancelNewTitle}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditing(true)}
            >
              {title}
            </span>

            <button
              aria-label="deleteTodo"
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={deleteCurTodo}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          { 'is-active': (isLoading && DeletedTodos.includes(id)) },
          'modal',
          'overlay',
        )}

      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
