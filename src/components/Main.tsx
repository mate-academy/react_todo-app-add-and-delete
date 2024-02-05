import React, { useContext, useState, useEffect } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/TodoContext';

export const Main: React.FC = () => {
  const {
    todos, filterTodoByStatus, status, tempTodo, errorMessage,
  } = useContext(TodoContext);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setVisibleTodos(filterTodoByStatus(todos, status));
  }, [todos, status, filterTodoByStatus]);

  return (

    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} items={todo} />
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
