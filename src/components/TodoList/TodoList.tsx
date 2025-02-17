import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/Todo';

type Props = {
  preparedTodos: Todo[];
  onDelete: (id: number) => Promise<void>;
  tempTodo: null | Todo;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  onDelete,
  tempTodo,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={id => onDelete(id)} />
      ))}

      {tempTodo && (
        <>
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            onDelete={id => onDelete(id)}
            isLoading={isLoading}
          />
        </>
      )}
    </section>
  );
};
