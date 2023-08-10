import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[],
  onDelete?: (id: number) => void,
  isLoading: boolean,
  loadingId: null | number,
  newTodo: null | Todo,
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete = () => {},
  isLoading,
  loadingId,
  newTodo,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={isLoading}
          loadingId={loadingId}
        />
      ))}

      {newTodo && (
        <TodoItem
          todo={newTodo}
          isLoading
          loadingId={0}
        />
      )}
    </section>
  );
};
