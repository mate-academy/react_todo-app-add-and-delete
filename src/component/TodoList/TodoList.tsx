import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number[]) => void;
  todosIsLoading: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  todosIsLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          isLoading={todosIsLoading.includes(todo.id)}
        />
      ))}
    </section>
  );
};
