import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  loadingIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodo={() => deleteTodo(todo.id)}
        isLoading={loadingIds.includes(todo.id)}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        key={tempTodo.id}
        deleteTodo={deleteTodo}
        isLoading={true}
      />
    )}
  </section>
);
