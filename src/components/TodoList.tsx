import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  deleteItem: (id: number) => void;
  updatingIds: number[] | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteItem,
  updatingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteItem={deleteItem}
          isUpdating={updatingIds?.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          deleteItem={deleteItem}
          isUpdating={true}
        />
      )}
    </section>
  );
};
