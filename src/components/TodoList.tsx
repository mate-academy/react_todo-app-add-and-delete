import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[],
  handleTodoDelete: (id: number) => void,
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  handleTodoDelete,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleTodoDelete}
        />
      ))}
    </>
  );
};
