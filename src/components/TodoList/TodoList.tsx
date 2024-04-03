import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onHandleDeleteTodo: (id: number) => void;
  currentId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onHandleDeleteTodo,
  currentId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onHandleDeleteTodo={onHandleDeleteTodo}
          currentId={currentId}
        />
      ))}
    </section>
  );
};
