import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TEMP_TODO_ID } from '../../api/todos';

interface Props {
  visibleTodos: Todo[];
  loadingTodoIds: number[];
  tempTodo?: Todo | null;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  loadingTodoIds,
  tempTodo,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={TEMP_TODO_ID}
          todo={tempTodo}
          isLoading={true}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
