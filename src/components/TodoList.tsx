import React from 'react';
import type { Todo } from '../types/Todo';
import Task from './Task';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingTodoIds: number[];
};

export default function TodoList({ todos, onDelete, deletingTodoIds }: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(task => (
         <Task
          key={task.id}
          todo={task}
          onDelete={() => onDelete(task.id)}
          isLoading={deletingTodoIds.includes(task.id)}
        />
      ))}
    </section>
  );
}
