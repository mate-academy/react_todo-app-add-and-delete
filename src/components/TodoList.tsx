import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  processingIds: number[];
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  processingIds,
  todos,
  tempTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          processing={processingIds.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <div className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </div>

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
