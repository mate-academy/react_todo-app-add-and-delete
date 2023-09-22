import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  items: Todo[],
};

export const TodoList: React.FC<Props> = ({ items }) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {items.map((item: Todo) => (
        <TodoItem todo={item} key={item.id} />
      ))}
    </section>
  );
};
