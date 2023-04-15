import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDeleteTodo: (id: number) => void,
  loadingTodos: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  loadingTodos,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        loadingTodos={loadingTodos}
      />
    ))}
    {tempTodo && (
      <TodoInfo
        key={tempTodo.id}
        todo={tempTodo}
        onDeleteTodo={onDeleteTodo}
        loadingTodos={loadingTodos}
      />
    )}
  </section>
);
