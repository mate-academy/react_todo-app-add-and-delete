import React from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  deletingIDs: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingIDs,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        deletingIDs={deletingIDs}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} />}
  </section>
);
