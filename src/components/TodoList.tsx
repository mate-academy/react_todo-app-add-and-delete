import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  processingTodoIds: number[];
  onDelete: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  processingTodoIds,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => {
      const isProcessing = processingTodoIds.includes(todo.id);

      return (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={isProcessing}
          onDelete={onDelete}
        />
      );
    })}
  </section>
);
