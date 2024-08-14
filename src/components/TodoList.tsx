/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  tempTitle: string;
  todoList: Todo[];
  tempTodo: Todo | null;
  editTodo: number;
  deleteTodo: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  field: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  tempTitle,
  field,
  todoList,
  tempTodo,
  editTodo,
  deleteTodo,
  onEdit,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(({ id, title, completed }) => (
        <TodoItem
          key={id}
          id={id}
          title={title}
          completed={completed}
          editTodo={editTodo}
          deleteTodo={deleteTodo}
          onEdit={onEdit}
          onDelete={onDelete}
          field={field}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo" key={0}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTitle}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
