import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  removeTodo: (id: number) => Promise<void>
};

export const TodoList: React.FC<Props> = ({ todos, removeTodo }) => (
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
