import React from 'react';
import { ToDo } from '../../types/ToDo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: ToDo[];
  updateTodo: (id: number, title: string) => void;
  removeTodo: (id: number) => void;
  markAsComplete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  removeTodo,
  markAsComplete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          updateTodo={updateTodo}
          removeTodo={removeTodo}
          markAsComplete={markAsComplete}
        />
      ))}
    </section>
  );
};
