import React from 'react';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[];
};

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
