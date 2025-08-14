// TodoList.tsx
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

// TodoList.tsx
type Props = {
  todos: Todo[];
  toggleTodo: (todo: Todo) => void;
  // isLoading: boolean;
  deleteTodo: (todo: number) => void;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  // isLoading,
  deleteTodo,
  tempTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          isLoading={deletingTodoIds.includes(todo.id)}
          deleteTodo={deleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          isLoading={true}
        />
      )}
    </section>
  );
};
