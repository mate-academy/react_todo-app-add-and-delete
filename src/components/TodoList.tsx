import React from 'react';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[];
  temporaryTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  deletingTodoIds: number[];
  isDeletingTodo: boolean;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  temporaryTodo,
  onDeleteTodo,
  deletingTodoIds,
  isDeletingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={deletingTodoIds.includes(todo.id)}
          onDeleteTodo={onDeleteTodo}
          isDisabled={isDeletingTodo}
        />
      ))}
      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          isLoading={true}
          onDeleteTodo={onDeleteTodo}
          isDisabled={true}
        />
      )}
    </section>
  );
};
