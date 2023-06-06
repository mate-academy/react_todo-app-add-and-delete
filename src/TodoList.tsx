import React from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  temporaryTodo: Todo | null;
  isLoading: boolean,
}

export const TodoList: React.FC<TodoListProps> = (
  {
    todos, onDelete, temporaryTodo, isLoading,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => onDelete(todo.id)}
          isLoading={isLoading}
        />
      ))}
      {temporaryTodo
        && (
          <TodoItem
            key={0}
            todo={temporaryTodo}
            onDelete={() => { }}
            isLoading={isLoading}
          />
        )}
    </section>
  );
};
