import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = React.memo(({ todos, removeTodo }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
        />
      ))}
    </section>
  );
});
