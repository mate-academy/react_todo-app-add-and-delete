import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  loadingTodo: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  loadingTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      )}
    </section>
  );
};
