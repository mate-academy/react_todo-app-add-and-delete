import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  onDelete: (value: number) => Promise<void>;
  deletedTodoId: number[] | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  isLoading,
  onDelete,
  deletedTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          onDelete={onDelete}
          isDeleting={deletedTodoId?.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem key={tempTodo.id} todo={tempTodo} isLoading={isLoading} />
      )}
    </section>
  );
};
