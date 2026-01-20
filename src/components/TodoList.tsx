import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  onDeleteTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  onDeleteTodo,
}) => {
  if (todos.length === 0 && !tempTodo) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem key={tempTodo.id} todo={tempTodo} isDeleting={false} isTemp />
      )}
    </section>
  );
};
