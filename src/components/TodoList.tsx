import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todoId: number, updates: Partial<Todo>) => Promise<void>;
  loadingTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onUpdateTodo,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          onUpdate={onUpdateTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <div className="todo todo--temp" data-cy="TempTodo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              disabled
              checked={tempTodo.completed}
            />
          </label>
          <span className="todo__title">
            {tempTodo.title}
            <div className="loader loader-margin"></div>
          </span>
        </div>
      )}
    </section>
  );
};
