import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, changeTodo } from '../../api/todos';
import { ErrorMessages } from '../../types/ErrorMessages';
import { UseTodosContext } from '../../utils/TodosContext';

type Props = { todo: Todo };

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const context = UseTodosContext();
  const {
    setTodos,
    setErrorMessage,
    isAllCompleted,
    setIsAllCompleted,
    isCompletedTodosCleared,
    setIsCompletedTodosCleared,
  } = context;

  const { title, completed, id } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const handleTodoDelete = (todoId: number) => {
    setTodos(prevState => prevState.filter(task => task.id !== todoId));
  };

  const removeTodo = () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => handleTodoDelete(id))
      .catch(() => setErrorMessage(ErrorMessages.CannotDelete))
      .finally(() => setIsLoading(false));
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(prevState => {
      const stateCopy = [...prevState];
      const updatedTodoIndex = stateCopy
        .findIndex(task => task.id === updatedTodo.id);

      stateCopy[updatedTodoIndex] = updatedTodo;

      return stateCopy;
    });
  };

  // eslint-disable-next-line
  const handleTodoUpdate = (updates: any) => {
    setIsLoading(true);

    changeTodo(id, updates)
      .then((newTodo) => updateTodo(newTodo))
      .catch(() => setErrorMessage(ErrorMessages.CannotUpdate))
      .finally(() => setIsLoading(false));
  };

  const handleCompletionStatusChange = () => {
    setIsAllCompleted(null);
    handleTodoUpdate({ completed: !completed });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleTodoUpdate({ title: editedTodoTitle });

    setIsEdited(false);
  };

  useEffect(() => {
    if (isAllCompleted !== null) {
      handleTodoUpdate({ completed: isAllCompleted });
    }
  }, [isAllCompleted]);

  useEffect(() => {
    if (completed && isCompletedTodosCleared) {
      removeTodo();
    }

    setIsCompletedTodosCleared(false);
  }, [isCompletedTodosCleared]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          name="completed"
          type="checkbox"
          className="todo__status"
          onChange={handleCompletionStatusChange}
          checked={completed}
        />
      </label>
      {isEdited
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTodoTitle}
              onBlur={() => setIsEdited(false)}
              onChange={(event) => setEditedTodoTitle(event.target.value)}
              // eslint-disable-next-line
              autoFocus
            />
          </form>
        )
        : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdited(true)}
          >
            {title}
          </span>
        )}

      <button
        data-cy="TodoDelete"
        onClick={removeTodo}
        type="button"
        className="todo__remove"
      >
        ×

      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
