import React from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[],
  setShowError: (val: Errors) => void
  inputValue: string,
  isAdding: boolean,
  targetTodoId: number,
  setTargetTodoId: (todoId: number) => void,
  completedDelete: boolean,
};

export const TodoList: React.FC<Props> = ({
  todoList,
  setShowError,
  inputValue,
  isAdding,
  targetTodoId,
  setTargetTodoId,
  completedDelete,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            setShowError={setShowError}
            targetTodoId={targetTodoId}
            setTargetTodoId={setTargetTodoId}
            completedDelete={completedDelete}
          />
        </li>
      ))}

      {isAdding && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {inputValue}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </ul>
  );
};
