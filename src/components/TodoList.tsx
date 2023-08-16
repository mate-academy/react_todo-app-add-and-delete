import React from 'react';
import { TodoItem } from './TodoItem';
import { useTodo } from '../hooks/useTodo';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = React.memo(({ tempTodo }) => {
  const { visibleTodos } = useTodo();

  return (
    <section className="todoapp__main">
      {visibleTodos().map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          loading
        />
      )}
    </section>
  );
});
