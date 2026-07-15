import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  processingIds: number[];
  onDelete: (id: number) => void;
  tempTodo?: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  processingIds,
  onDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={processingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isProcessing={true} onDelete={() => {}} />
      )}
    </section>
  );
};
