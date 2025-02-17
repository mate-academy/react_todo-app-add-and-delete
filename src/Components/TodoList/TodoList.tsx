import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  isLoading: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  isLoading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos &&
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            isLoading={isLoading.includes(todo.id)}
          />
        ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => {}}
          isLoading={isLoading.includes(0)}
        />
      )}
    </section>
  );
};
