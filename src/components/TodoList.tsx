import React, { useContext } from 'react';

import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodoContext/TodoContext';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo, errorMessage } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => <TodoItem todo={todo} key={todo.id} />)}
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
