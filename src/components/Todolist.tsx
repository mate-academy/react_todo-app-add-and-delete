/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  showUpdateInput: boolean;
  loading: boolean;
  handleCompletedTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo) => void;
};

export const List: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  showUpdateInput,
  handleCompletedTodo,
  deleteTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loadingTodoIds.includes(todo.id)}
          handleCompletedTodo={handleCompletedTodo}
          deleteTodo={deleteTodo}
          showUpdateInput={showUpdateInput}
          updateTodo={updateTodo}
        />
      ))}
      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className={`todo ${tempTodo.completed ? 'completed' : ''}`}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={() => handleCompletedTodo(tempTodo)}
            />
          </label>
          <div
            data-cy="TodoLoader"
            className={`modal overlay is-active ${loadingTodoIds.includes(tempTodo.id) && 'is-active'}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(tempTodo.id)}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
};
