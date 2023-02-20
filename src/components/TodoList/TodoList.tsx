import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  deletedTodo: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  deletedTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          deletedTodo={deletedTodo}
        />
      ))}
    </section>
  );
};
