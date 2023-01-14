import React, { useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  onDeleteItem: (id: number) => void;
  currentTitle: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  onDeleteItem,
  currentTitle,
}) => {
  const user = useContext(AuthContext);

  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <li>
          <TodoItem
            key={todo.id}
            todo={todo}
            isAdding={todo.isLoading}
            onDeleteItem={onDeleteItem}
          />
        </li>
      ))}

      {isAdding && user && (
        <li>
          <TodoItem
            key={0}
            todo={{
              id: 0,
              title: currentTitle,
              completed: false,
              userId: user.id,
              isLoading: true,
            }}
            isAdding
            onDeleteItem={onDeleteItem}
          />
        </li>
      )}
    </ul>
  );
};
