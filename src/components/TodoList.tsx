import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          removeTodo={removeTodo}
          todo={tempTodo}
        />
      )}
    </section>
  );
};
