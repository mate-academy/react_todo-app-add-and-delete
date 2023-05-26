import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => void;
  isLoading: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDelete,
  isLoading,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          key={`todos-${todo.id}`}
          todo={todo}
          handleDelete={handleDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={`tempTodo-${tempTodo.id}`}
          todo={tempTodo}
          handleDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </section>
  );
};
