/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import React, { useState } from 'react';

import { useAppContext } from '../../../context/AppContext';

import { Todo, Todo as TodoType } from '../../../types/Todo';

import {
  useRemoveTodo,
  useRenameTodo,
  useToggleTodoCompletion,
} from '../../../utils/todoHandlers';

type Props = {
  todo: TodoType;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const { loadingTodos } = useAppContext();
  const [isTodoEdited, setIsTodoEdited] = useState(false);
  const [todoQuery, setTodoQuery] = useState(title);

  const renameTodo = useRenameTodo(todoQuery, setTodoQuery, setIsTodoEdited);
  const toggleTodoCompletion = useToggleTodoCompletion();
  const removeTodo = useRemoveTodo();

  function handleRename(currentTodo: Todo, e: React.KeyboardEvent) {
    renameTodo(currentTodo, e);
  }

  function handleToggleTodoCompletion(todoId: number) {
    toggleTodoCompletion(todoId);
  }

  function handleRemove(todoId: number) {
    removeTodo(todoId);
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
      onDoubleClick={() => setIsTodoEdited(true)}
    >
      <label
        className="todo__status-label"
        aria-label="Toggle todo status"
        onChange={() => handleToggleTodoCompletion(id)}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isTodoEdited ? (
        <form name="todoForm" onSubmit={e => e.preventDefault()}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todo__title-field"
            value={todoQuery}
            onKeyDown={e => handleRename(todo, e)}
            onBlur={() => setIsTodoEdited(false)}
            onChange={e => setTodoQuery(e.target.value)}
            autoFocus
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      )}

      {!isTodoEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleRemove(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodos.find(t => t?.id === id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
