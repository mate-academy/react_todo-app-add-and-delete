import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    onDelete,
    deletingTodoIds,
    tempTodo,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={deletingTodoIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
          isLoading={tempTodo !== null}
        />
      )}
    </section>
  );
};
