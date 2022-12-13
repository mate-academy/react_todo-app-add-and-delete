import React from 'react';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

interface Props {
  todos: Todo[],
  deletingTodo: number,
  deletingTodos: number[],
  onRemoveTodo: (todoId: number) => Promise<void>,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  deletingTodo,
  deletingTodos,
  onRemoveTodo,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoComponent
          todo={todo}
          key={todo.id}
          onRemoveTodo={onRemoveTodo}
          deletingTodo={deletingTodo}
          deletingTodos={deletingTodos}
        />
      ))}
    </>
  );
});
