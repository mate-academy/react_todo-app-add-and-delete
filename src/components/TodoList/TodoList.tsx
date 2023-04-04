import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  removeTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          removeTodo={removeTodo}
        />
      )}
    </section>
  );
});
