import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onSelect?: (todo: Todo) => void;
};

// eslint-disable-next-line max-len
export const TodoList: React.FC<Props> = ({ todos, onDelete, onSelect }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(e => (
      <TodoItem
        key={e.id}
        todo={e}
        onDelete={onDelete}
        onSelect={onSelect}
        data-cy="Todo"
      />
    ))}
  </section>
);
