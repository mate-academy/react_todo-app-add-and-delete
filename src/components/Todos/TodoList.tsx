import React from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';
import { Todo } from '../../types/Todo';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  isAdding: boolean;
  deleteTodoToState: (todoId: number) => void;
  changeError: (value: ErrorTypes | null) => void;
  todosInProcess: number[] | null;
}

const TodoList: React.FC<Props> = (
  {
    todos,
    isAdding,
    deleteTodoToState,
    changeError,
    todosInProcess,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
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
            Create todo...
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
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodoToState={deleteTodoToState}
          changeError={changeError}
          todosInProcess={todosInProcess}
        />
      ))}
    </section>
  );
};

export default TodoList;
