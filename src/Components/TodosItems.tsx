import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useTodo } from '../Hooks/UseTodo';
import { deleteTodos } from '../api/todos';
import { ErrorMessage } from '../Enum/ErrorMessage';

type Props = {
  items: Todo;
  isProcessed: boolean;
};

export const TodosItems: React.FC<Props> = ({ items, isProcessed }) => {
  const {
    todo, setTodo, setIsToggleAll, setIsError,
  } = useTodo();
  const [showLoadind, setShowLoadind] = useState(isProcessed);

  const handleCompleteTodo = () => {
    const newTodos = (currentTodos: Todo[]) => currentTodos.map(todoItem => (
      items.id === todoItem.id
        ? { ...todoItem, completed: !items.completed }
        : todoItem
    ));

    setIsToggleAll(newTodos.length < 1);
  };

  const handleDeleteTodo = () => {
    setShowLoadind(true);
    const filterTodos = todo.filter(todoItem => todoItem.id !== items.id);

    return deleteTodos(items.id)
      .then(() => setTodo(filterTodos))
      .catch(() => setIsError(ErrorMessage.DELETE));
  };

  return (
    <>
      <div
        className={classNames(
          'todo',
          { completed: items.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={items.completed}
            onChange={handleCompleteTodo}
            disabled={isProcessed}
          />
        </label>

        <span className="todo__title">{items.title}</span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          onClick={() => handleDeleteTodo()}
          disabled={isProcessed}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        {/* 'is-active' class puts this modal on top of the todo */}
        {showLoadind && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
};
