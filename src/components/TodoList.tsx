import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[],
  onDelete: (id: number) => void,
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};
