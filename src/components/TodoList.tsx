import React from 'react';
import type { Todo } from '../types/Todo';
import Task from './Task';

type Props = {
  todos: Todo[];
};

export default function TodoList({ todos }: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(task => (
        <Task key={task.id} todo={task} />
      ))}
    </section>
  );
}
