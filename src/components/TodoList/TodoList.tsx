import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  tempTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          isLoading={loadingIds.includes(todo.id)}
          isTemporary={false}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onToggle={() => {}}
          onDelete={onDelete}
          isLoading={true}
          isTemporary={true}
        />
      )}
    </section>
  );
};
