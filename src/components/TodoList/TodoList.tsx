import React from 'react';

import { Todo } from '../../types/Todo';

import { TodoInfo } from '../TodoInfo';

interface Props {
  todos: Todo[];
  isAdding: boolean;
  todoTitle: string;
  onDeleteTodo: (todoId: number) => void;
  deletedTodoId: number;
  deletedTodoIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  todoTitle,
  onDeleteTodo,
  deletedTodoId,
  deletedTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          deletedTodoId={deletedTodoId}
          deletedTodoIds={deletedTodoIds}
        />
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
            {todoTitle}
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
    </section>
  );
};
