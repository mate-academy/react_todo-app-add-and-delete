import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  onDelete: (todoId: number) => void;
  todos: Todo[];
}

export const TodoList: React.FC<Props> = ({ onDelete, todos }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </section>
  );
};
