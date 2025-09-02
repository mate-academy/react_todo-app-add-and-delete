import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  onDelete: (id: number) => void;
};

export const Section: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  onDelete,
}) => {
  if (todos.length === 0 && !tempTodo) {
    return null;
  }

  const allTodos = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {allTodos.map(todo => (
        <TodoItem
          key={todo.id || 'temp'}
          todo={todo}
          deleting={deletingTodoIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
