import React from 'react';
import { ClientTodo } from '../../types';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: ClientTodo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
