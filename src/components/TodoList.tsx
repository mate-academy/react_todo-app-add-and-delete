import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDeletedTodo: (id: number) => Promise<void>;
  deletedTodosId: number[];
  completedTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  onDeletedTodo,
  deletedTodosId,
}) => {
  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeletedTodo={onDeletedTodo}
          deletedTodosId={deletedTodosId}
        />
      ))}

      {tempTodo && (
        <TodoItem tempTodo={tempTodo} onDeletedTodo={onDeletedTodo} />
      )}
    </>
  );
};
