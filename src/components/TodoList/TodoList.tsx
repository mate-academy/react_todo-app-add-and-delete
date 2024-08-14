import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInput } from '../TodoInput/TodoInput';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodoClick: (id: number) => void;
  isDeletedTodoHasLoader: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodoClick,
  isDeletedTodoHasLoader,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInput
          todo={todo}
          key={todo.id}
          handleDeleteTodoClick={handleDeleteTodoClick}
          isDeletedTodoHasLoader={isDeletedTodoHasLoader}
        />
      ))}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
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

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
