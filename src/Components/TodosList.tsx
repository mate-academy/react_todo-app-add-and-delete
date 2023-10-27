import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  deleteTodo: (id: number) => void,
  loading: number[],
  tempTodo: Todo | null,
}

export const TodosList: React.FC<Props> = ({
  todos,
  deleteTodo,
  loading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isLoading={loading.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isLoading={loading.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};
