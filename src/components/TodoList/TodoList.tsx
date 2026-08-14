import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={true}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
