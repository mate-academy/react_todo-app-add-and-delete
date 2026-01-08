import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, completed: boolean) => void;
  tempTodo: Todo | null;
  deletingTodo: number | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onStatusChange,
  tempTodo,
  deletingTodo: deletingTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        isLoading={deletingTodo === todo.id}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} isLoading />}
  </section>
);
