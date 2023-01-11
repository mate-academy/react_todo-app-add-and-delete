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
}) => (
  <ul className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <li key={todo.id}>
        <TodoItem
          todo={todo}
          isAdding={isIncludeId.includes(todo.id)}
          onDeleteItem={onDeleteItem}
        />
      </li>
    ))}

    {tempTodo && (
      <li key={0}>
        <TodoItem
          todo={tempTodo}
          isAdding
          onDeleteItem={onDeleteItem}
        />
      </li>
    )}
  </ul>
);

