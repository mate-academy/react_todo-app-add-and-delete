import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  sortedTodos: Todo[];
  loadingTodo: Todo | null;
  errorFunction: (el: string) => void;
  deletingFunction: (el: boolean) => void;
  deletingListId: number[];
};

export const TodoList: React.FC<Props> = ({
  sortedTodos,
  loadingTodo,
  errorFunction,
  deletingFunction,
  deletingListId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {sortedTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          errorFunction={errorFunction}
          deletingFunction={deletingFunction}
          deletingListId={deletingListId}
        />
      ))}
      {loadingTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor={`tempTodoStatus`}>
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              id={`tempTodoStatus`}
              aria-label={`Mark as ${loadingTodo.completed ? 'incomplete' : 'complete'}`}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {loadingTodo.title}
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
