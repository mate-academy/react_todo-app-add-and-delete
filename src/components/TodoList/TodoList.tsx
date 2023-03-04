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
        <ul>
          {todos.map((todo) => (
            <li>
              <TodoItem
                key={todo.id}
                todo={todo}
                onRemoveTodo={onRemoveTodo}
                onCompletedChange={onCompletedChange}
              />
            </li>

          ))}

          {isTemp && (
            <li>
              <TodoItem
                todo={isTemp}
                withLoader
                onRemoveTodo={onRemoveTodo}
                onCompletedChange={onCompletedChange}
              />
            </li>
          )}

        </ul>
      </section>
    );
  },
);
