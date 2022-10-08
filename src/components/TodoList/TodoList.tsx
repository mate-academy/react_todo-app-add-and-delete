import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  removeTodo: (TodoId: number) => void;
  isSelectId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  removeTodo,
  isSelectId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={isLoading}
        removeTodo={removeTodo}
        isSelectId={isSelectId}
      />
    ))}
  </section>
);
