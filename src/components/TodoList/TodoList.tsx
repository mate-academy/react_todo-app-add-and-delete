import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  onRemove: (id: number) => void,
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onRemove,
  loadingIds,
}) => {
  return (
    <>
      <section className="todoapp__main">
        {todos.map(todo => {
          const isLoading = loadingIds.some(id => id === todo.id);

          return (
            <TodoItem
              isLoading={isLoading}
              todo={todo}
              key={todo.id}
              onRemove={onRemove}
            />
          );
        })}
      </section>
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onRemove={() => {}}
          isLoading
        />
      )}
    </>
  );
};
