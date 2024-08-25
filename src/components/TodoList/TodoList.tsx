/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  tempTodo: TodoType | null;
  todos: TodoType[];
  todoIdToDelete: number;
  isClearLoading: boolean;
  deleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  todoIdToDelete,
  isClearLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={deleteTodo}
          todoIdToDelete={todoIdToDelete}
          isClearLoading={isClearLoading}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
