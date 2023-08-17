import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  loadingTodoId: number | null,
  onDelete: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoId,
  onDelete,
}) => {
  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          loading={loadingTodoId === todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
          loading={loadingTodoId === tempTodo.id}
        />
      )}
    </ul>
  );
};
