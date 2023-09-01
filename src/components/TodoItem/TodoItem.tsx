/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext, useEffect, useState,
} from 'react';
import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../../TodoProvider';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const {
    todos,
    setTodos,
    tempTodo,
    setErrorMessage,
    toDelete,
    setToDelete,
  } = useContext(TodosContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeCheck = () => {
    const newTodos = todos.map(currTodo => {
      if (currTodo.id === id) {
        return {
          ...currTodo,
          completed: !completed,
        };
      }

      return currTodo;
    });

    setTodos(newTodos);
  };

  const handleDelete = () => {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => setTodos(currTodos => [...currTodos]
        .filter(currTodo => currTodo.id !== id)))
      .catch(() => {
        setErrorMessage('Unable to delete todo');
      })
      .finally(() => {
        setIsLoading(false);
        setToDelete([]);
      });
  };

  useEffect(() => {
    if (tempTodo) {
      setIsLoading(true);
    }

    if (toDelete.includes(id)) {
      handleDelete();
    }
  }, [toDelete]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCheck}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="deleteTodo"
        onClick={() => handleDelete()}
      >
        ×
      </button>
      <div
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
