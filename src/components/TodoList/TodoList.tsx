import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete?: (id: number[]) => void;
  tempTodo: Todo | null;
  deletedIds: number[];
  adding: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete = () => {},
  deletedIds,
  tempTodo,
  adding,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          deletedIds={deletedIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={onDelete}
          deletedIds={deletedIds}
          adding={adding}
        />
      )}
    </section>
  );
};
