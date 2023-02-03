import React, { } from 'react';
import { ListItem } from './ListItem';
import { Todo } from '../types/Todo';

type Props = {
  setOfItems: Todo[],
  deleteItem: (todoId: number) => void,
};

export const TodosList: React.FC<Props> = ({ setOfItems, deleteItem }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {setOfItems.map(todo => (
        <ListItem
          key={todo.id}
          todo={todo}
          deleteItem={deleteItem}
        />
      ))}
    </section>
  );
};
