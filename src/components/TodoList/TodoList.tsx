import React from 'react';
import { useTodos } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  items: Todo[],
};

export const TodoList: React.FC<Props> = ({ items }) => {
  const { tempTodo } = useTodos();

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {items.map((item: Todo) => (
        <TodoItem todo={item} key={item.id} />
      ))}
      {tempTodo && (<TodoItem todo={tempTodo} />)}
    </section>
  );
};
