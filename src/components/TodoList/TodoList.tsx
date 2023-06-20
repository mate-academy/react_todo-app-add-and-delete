import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void
}

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, onDelete,
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
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
