import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  tempTodo,
}) => {
  const state = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {state.map(todo => (
        <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
      ))}
    </section>
  );
};
