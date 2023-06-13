import React from 'react';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  loadingTodos: number[];
  tempTodo: Todo | null;
  removeTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  loadingTodos,
  tempTodo,
  removeTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadingTodos={loadingTodos}
          removeTodo={removeTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadingTodos={loadingTodos}
          removeTodo={removeTodo}
        />
      )}
    </section>
  );
});
