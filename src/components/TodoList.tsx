import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[] | null;
  onDelete: (id: number) => void;
  loadingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={loadingTodoId === todo.id}
        />
      ))}
    </section>
  );
};
