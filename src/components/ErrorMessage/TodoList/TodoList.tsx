import React from 'react';

import { Todo } from '../../../types/Todo';
import { TodoItem } from '../../TodoItem/TodoItem';

interface TodoListProps {
  todoList: Todo[];
  tempTodo: Todo | null;
  filterTodoList: (todoId: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todoList,
  tempTodo,
  filterTodoList,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          filterTodoList={filterTodoList}
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
