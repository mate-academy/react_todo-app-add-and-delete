import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  filter: 'all' | 'active' | 'completed';
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  deletingTodoIds,
  filter,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && filter !== 'completed' && (
        <TodoItem todo={tempTodo} isTemp onDelete={() => {}} />
      )}
    </section>
  );
};
