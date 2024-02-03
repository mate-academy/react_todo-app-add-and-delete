import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  items: Todo[],
}

export const Main: React.FC<Props> = ({ items }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {items.map((todo) => (
        <TodoItem key={todo.id} todoItem={todo} />
      ))}
    </section>
  );
};
