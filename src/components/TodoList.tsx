import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading />}
    </section>
  );
};
