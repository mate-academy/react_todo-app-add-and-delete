import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  onDelete: (id: number) => void;
  newTodo: Todo | null;
}
export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  newTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {newTodo && (
        <TodoItem
          todo={newTodo}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
