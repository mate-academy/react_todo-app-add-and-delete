import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onCompletedChange?: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onCompletedChange,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onCompletedChange={onCompletedChange}
        />
      ))}
    </section>
  );
};
