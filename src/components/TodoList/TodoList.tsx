import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  data: Todo[];
}

export const TodoList: React.FC<Props> = ({ data }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {data.map(item => (
        <TodoItem todo={item} key={item.id} />
      ))}
    </section>
  );
};
