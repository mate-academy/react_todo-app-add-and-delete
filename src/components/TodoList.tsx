import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodoIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} onDelete={() => {}} isLoading />}
    </section>
  );
};
