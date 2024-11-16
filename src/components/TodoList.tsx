import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTodo,
  loadingTodoId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        loadingTodoId={loadingTodoId}
      />
    ))}
  </section>
);
