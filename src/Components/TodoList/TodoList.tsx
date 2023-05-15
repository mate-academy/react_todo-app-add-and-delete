import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => (
  <section className="todoapp__main">
    {todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
  </section>
);
