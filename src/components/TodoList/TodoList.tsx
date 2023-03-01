import React from 'react';

import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  isTemp: Todo | null,
  onRemoveTodo: (id: number) => void
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, isTemp, onRemoveTodo }) => {
    return (
      <section className="todoapp__main">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onRemoveTodo={onRemoveTodo} />
        ))}

        {isTemp && (
          <TodoItem todo={isTemp} withLoader onRemoveTodo={onRemoveTodo} />
        )}
      </section>
    );
  },
);
