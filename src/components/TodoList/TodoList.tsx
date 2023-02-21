import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  performancedTodo: Todo[],
  tempTodo: Todo | null,
  removeTodo: (todoToDelete: Todo) => Promise<void>,

};

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, removeTodo, performancedTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          removeTodo={removeTodo}
          isLoading={performancedTodo.includes(todo)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          isLoading
        />
      )}
    </section>
  );
};
