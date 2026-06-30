import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  processingIds: number[];
  tempTodo: Todo | null; // Додали tempTodo сюди
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* Рендеримо основний список тудушок */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isProcessing={processingIds.includes(todo.id)}
        />
      ))}

      {/* Якщо є тимчасовий туду, рендеримо його в самому кінці списку */}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => {}}
          isProcessing={processingIds.includes(0)}
        />
      )}
    </section>
  );
};
