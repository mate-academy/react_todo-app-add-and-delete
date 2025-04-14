import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  updateTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onClick={() => removeTodo(todo.id)}
          onCheckboxClick={() => updateTodo(todo.id)}
        />
      ))}
    </section>
  );
};
