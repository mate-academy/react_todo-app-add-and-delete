import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ visibleTodos, deleteTodo }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {visibleTodos.map(todo => (
      <TodoInfo
        todo={todo}
        deleteTodo={deleteTodo}
        key={todo.id}
      />
    ))}
  </section>

);
