import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoElement } from '../newTodo/TodoElement';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingIds: number[]
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
}) => {
  return (
    <>
      {todos.map(todo => {
        const isLoading = loadingIds.some(id => id === todo.id);

        return (
          <TodoElement
            todo={todo}
            key={todo.id}
            onDelete={() => onDelete(todo.id)}
            isLoading={isLoading}
          />
        );
      })}

      {tempTodo && (
        <TodoElement
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={() => onDelete(tempTodo.id)}
          isLoading
        />
      )}
    </>
  );
};
