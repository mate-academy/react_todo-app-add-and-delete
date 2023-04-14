import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[],
  temporaryTodo: Todo | null,
  onDelete: (id: number) => void,
  onToggle: (id: number) => void,
  loadingTodoIds: number,
};

export const TodoList: React.FC<Props> = ({
  todos, temporaryTodo, onDelete, onToggle, loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading={loadingTodoIds === todo.id}
        // isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {temporaryTodo && (
        <TodoInfo
          todo={temporaryTodo}
          key={temporaryTodo.id}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading
        />
      )}
    </section>
  );
};
