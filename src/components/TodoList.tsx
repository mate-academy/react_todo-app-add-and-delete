import React from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

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
        <TodoElement
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      ))}

      {tempTodo && (
        <TodoElement
          todo={tempTodo}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
        />
      )}
    </section>
  );
};
