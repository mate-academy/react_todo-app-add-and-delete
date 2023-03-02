import React from 'react';

import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  isTemp?: Todo | null,
  onRemoveTodo: (id: number) => void,
  onCompletedChange: (value: Todo) => void
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos, isTemp, onRemoveTodo, onCompletedChange,
  }) => {
    return (
      <section className="todoapp__main">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onRemoveTodo={onRemoveTodo}
            onCompletedChange={onCompletedChange}
          />
        ))}

        {isTemp && (
          <TodoItem
            todo={isTemp}
            withLoader
            onRemoveTodo={onRemoveTodo}
            onCompletedChange={onCompletedChange}
          />
        )}
      </section>
    );
  },
);
