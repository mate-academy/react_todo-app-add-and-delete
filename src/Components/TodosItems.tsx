import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useTodo } from '../Hooks/UseTodo';
import { deleteTodos } from '../api/todos';
import { ErrorMessage } from '../Enum/ErrorMessage';

type Props = {
  items: Todo;
};

export const TodosItems: React.FC<Props> = ({ items }) => {
  const {
    todo, setTodo, setIsToggleAll, loading, setloading, setIsError,
  } = useTodo();

  const handleCompleteTodo = () => {
    const newTodos = (currentTodos: Todo[]) => currentTodos.map(todoItem => (
      items.id === todoItem.id
        ? { ...todoItem, completed: !items.completed }
        : todoItem
    ));

    setIsToggleAll(newTodos.length < 1);
  };

  const filterTodos = todo.filter(todoItem => todoItem.id !== items.id);

  const handleDeleteTodo = () => {
    setloading(true);

    return deleteTodos(items.id)
      .then(() => {
        setTodo(filterTodos);
      })
      .catch(() => setIsError(ErrorMessage.DELETE))
      .finally(() => {
        setloading(false);
      });
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
          />
        </label>

        <span className="todo__title">{items.title}</span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          onClick={() => handleDeleteTodo()}
          disabled={loading}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        {/* 'is-active' class puts this modal on top of the todo */}
        <div className={classNames(
          'modal overlay',
          { 'is-active': loading },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
