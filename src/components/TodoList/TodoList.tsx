import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export type Props = {
  todos: Todo[],
  onDeleteTodo(id: number): void,
  tempTodo: Todo | null,
  loadingTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  loadingTodoIds,
  tempTodo,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoading
        />
      )}
    </ul>
  );
};
