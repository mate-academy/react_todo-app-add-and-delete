// TodoList.tsx
import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onHandleDeleteTodo: (id: number) => void;
  currentId: number | null;
  tempTodo: Todo | null; // Add tempTodo to props
};

export const TodoList: React.FC<Props> = ({
  todos,
  onHandleDeleteTodo,
  currentId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onHandleDeleteTodo={onHandleDeleteTodo}
          currentId={currentId}
        />
      )}
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
