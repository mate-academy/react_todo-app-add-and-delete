import React from 'react';

import { TodoItem } from '../../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onRemoveTodo: (todoId: number) => void
  onCheckedTodo: (todoId: number) => void
};

export const Todos: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  onCheckedTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          onCheckedTodo={onCheckedTodo}
        />
      ))}
    </section>
  );
};
