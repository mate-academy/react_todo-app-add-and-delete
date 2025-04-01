import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<void>;
  loadingTodos: Set<number>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  loadingTodos,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={() => deleteTodo(todo.id)}
        isLoading={loadingTodos.has(todo.id)}
      />
    ))}

    {tempTodo && (
      <TodoItem key={tempTodo.id} todo={tempTodo} isTemp isLoading={true} />
    )}
  </section>
);
