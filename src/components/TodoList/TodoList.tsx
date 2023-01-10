import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isIncludeId: number[];
  onDeleteItem: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isIncludeId,
  onDeleteItem,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <li>
          <TodoItem
            key={todo.id}
            todo={todo}
            isAdding={isIncludeId.includes(todo.id)}
            onDeleteItem={onDeleteItem}
          />
        </li>
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isAdding
          onDeleteItem={onDeleteItem}
        />
      )}
    </ul>
  );
};
