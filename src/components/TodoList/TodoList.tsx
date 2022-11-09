import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isAdding: boolean;
  onDelete: (id: number) => Promise<void>;
  activeTodoId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isAdding,
  onDelete,
  activeTodoId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDelete={onDelete}
        activeTodoId={activeTodoId}
      />
    ))}

    {isAdding && tempTodo && (
      <TodoItem
        todo={tempTodo}
        key={tempTodo.id}
        onDelete={onDelete}
        activeTodoId={activeTodoId}
      />
    )}
  </section>
);
