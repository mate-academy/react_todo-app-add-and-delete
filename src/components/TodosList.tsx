import React, { } from 'react';
import { ListItem } from './ListItem';
import { Todo } from '../types/Todo';

type Props = {
  setOfItems: Todo[],
  deleteItem: (todoId: number) => void,
  isProcessing: boolean,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
};

export const TodosList: React.FC<Props> = ({
  setOfItems, deleteItem, isProcessing, setIsProcessing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {setOfItems.map(todo => (
        <ListItem
          key={todo.id}
          todo={todo}
          deleteItem={deleteItem}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      ))}
    </section>
  );
};
