import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './todoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onUpdateTitle: (id: number, title: string) => void;
  loadingId: number | null;
};

export const FormBody: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  onUpdateTitle,
  loadingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.clientId ?? todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
          isLoading={loadingId === todo.id}
        />
      ))}
    </section>
  );
};
