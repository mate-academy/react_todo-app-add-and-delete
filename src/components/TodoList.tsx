/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onTodoStatusChange: (id: number) => void;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  loading: boolean;
  deletingTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onTodoStatusChange,
  onDelete,
  tempTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onTodoStatusChange={onTodoStatusChange}
          isLoading={deletingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          onDelete={() => {}}
          onTodoStatusChange={() => {}}
          isLoading={true}
        />
      )}
    </section>
  );
};
