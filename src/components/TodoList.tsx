import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, completed: boolean) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onStatusChange,
  tempTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} isLoading />}
  </section>
);
