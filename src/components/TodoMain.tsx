import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoMainProps {
  todos: Todo[];
  tempTodo?: Todo | null;
  onUpdateTodo: (id: number, data: Partial<Todo>) => void;
  onDeleteTodo: (id: number) => void;
  processingIds?: number[];
}

export const TodoMain: React.FC<TodoMainProps> = ({
  todos,
  tempTodo,
  onUpdateTodo,
  onDeleteTodo,
  processingIds = [],
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todoapp__list" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
            isProcessing={processingIds.includes(todo.id)}
          />
        ))}

        {tempTodo && (
          <TodoItem
            key="temp"
            todo={tempTodo}
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
            isProcessing={true}
            isTemporary={true}
          />
        )}
      </ul>
    </section>
  );
};
