import React, { } from 'react';
import { ListItem } from './ListItem';
import { Todo } from '../types/Todo';

type Props = {
  setOfItems: Todo[],
  deleteItem: (todoId: number) => void,
  tempTodo: Todo | null,
  setMessageError: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
  isProcessing: boolean,
};

export const TodosList: React.FC<Props> = ({
  setOfItems, deleteItem, tempTodo, setMessageError, setError, isProcessing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {setOfItems.map(todo => (
        <ListItem
          key={todo.id}
          todo={todo}
          deleteItem={deleteItem}
          setMessageError={setMessageError}
          setError={setError}
        />
      ))}

      {tempTodo && isProcessing && (
        <ListItem
          todo={tempTodo}
          deleteItem={deleteItem}
          setMessageError={setMessageError}
          setError={setError}
        />
      )}
    </section>
  );
};
