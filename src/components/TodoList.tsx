import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC<{
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (id: number) => void;
}> = ({ todos, tempTodo, processingIds, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={processingIds.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isProcessing />}
    </section>
  );
};
