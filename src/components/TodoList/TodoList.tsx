import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  processingIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processingIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDelete={onDelete}
        processingIds={processingIds}
      />
    ))}
  </section>
);
