import React from 'react';
import { TodoListProps } from '../types/TodoList';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  handleTodoDelete,
  handleTodoToggle,
  handleTodoUpdate,
  isLoading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading[todo.id]}
          handleTodoDelete={handleTodoDelete}
          handleTodoToggle={handleTodoToggle}
          handleTodoUpdate={handleTodoUpdate}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleTodoToggle={handleTodoToggle}
          handleTodoDelete={handleTodoDelete}
          handleTodoUpdate={handleTodoUpdate}
          isLoading={isLoading[tempTodo.id]}
        />
      )}
    </section>
  );
};
