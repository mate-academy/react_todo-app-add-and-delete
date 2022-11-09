import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { updateTodo, deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  handleLoadTodos: () => void;
};

export const InfoTodo: React.FC<Props> = ({ todo, handleLoadTodos }) => {
  const { title, completed } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(title);
  const [isDoubleClick, setIsDoubleClick] = useState(false);

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={async () => {
            setIsLoading(true);
            await updateTodo(todo.id, { completed: !completed });
            setIsLoading(false);
            handleLoadTodos();
          }}
        />
      </label>

      {!isDoubleClick ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDoubleClick(true)}
          >
            {value}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={async () => {
              setIsLoading(true);
              await deleteTodo(todo.id);
              handleLoadTodos();
            }}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateTodo(todo.id, { title: value });
            setIsDoubleClick(false);
          }}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
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
