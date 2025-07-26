import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/todoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
    ))}
  </section>
);
