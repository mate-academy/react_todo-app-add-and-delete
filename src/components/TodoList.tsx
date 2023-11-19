import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
        />
      )}
    </section>
  );
});
