import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  tempTodo?: Todo | null,
  onDelete?: (todoId: number) => void,
  idsForLoader: number[],
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  idsForLoader,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        isLoading={idsForLoader.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && (
      <TodoItem todo={tempTodo} />
    )}
  </section>
);
