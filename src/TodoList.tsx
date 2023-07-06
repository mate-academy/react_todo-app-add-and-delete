import React from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[]
  removeTodo: (todoIduserId: number) => void;
  loadingTodos: number[];
}

export const Todolist: React.FC<Props> = ({
  todos,
  removeTodo,
  loadingTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          loadingTodos={loadingTodos}
        />
      ))}
    </section>
  );
};
