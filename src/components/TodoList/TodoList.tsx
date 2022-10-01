import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  selectedTodosId: number[];
  newTitle: string,
  onDelete: (id: number[]) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  selectedTodosId,
  newTitle,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodosId={selectedTodosId}
          onDelete={onDelete}
        />
      ))}
      {isAdding && (
        <TodoItem
          todo={todos[0]}
          isActive={isAdding}
          newTitle={newTitle}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
