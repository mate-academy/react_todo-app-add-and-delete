import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  handleDeleteTodo:(todoId: number) => void,
  deletingTodosIds: number[]
  newTitle: string,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  newTitle,
  handleDeleteTodo,
  deletingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodosIds={deletingTodosIds}
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
            {newTitle}
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
