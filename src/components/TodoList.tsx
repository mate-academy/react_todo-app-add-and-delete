import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingTodoId: number[];
  // onToggleComplete: (id: number, completed: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoId,
  onDelete,
  // onToggleComplete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          // onToggleComplete={onToggleComplete}
          isLoading={loadingTodoId.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          onDelete={onDelete}
          // onToggleComplete={onToggleComplete}
          isLoading={true}
        />
      )}
    </section>
  );
};
