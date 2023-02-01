import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
        />
      )}
    </section>
  );
};
