import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  handleDeleteTodo: (id: number) => void;
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos, handleDeleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </section>
  );
};
