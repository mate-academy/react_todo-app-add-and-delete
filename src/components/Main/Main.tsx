import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../../context/TodosContext';

interface Props {
  items: Todo[],
}

export const Main: React.FC<Props> = ({ items }) => {
  const { tempTodo, errorMessage } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {items.map((todo) => (
        <TodoItem key={todo.id} todoItem={todo} />
      ))}
      {!!tempTodo && !errorMessage && (
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

          {/* 'is-active' class puts this modal on top of the todo */}
          <div
            data-cy="TodoLoader"
            className="modal overlay is-active"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
