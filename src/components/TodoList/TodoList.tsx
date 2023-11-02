import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  items: Todo[];
};

export const TodoList: React.FC<Props> = ({ items }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {items?.map(item => (
        <TodoItem item={item} key={item.id} />
      ))}
    </section>
  );
};
