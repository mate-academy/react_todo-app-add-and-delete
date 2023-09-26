import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onTodoDelete: (todoId: number) => void,
  onTodoUpdate: (todo: Todo, newTodoTitle: string) => void,
  isProcessing: number[],
  tempTodo: Todo | null,
};

export const TodosList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  onTodoUpdate,
  isProcessing,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          onTodoUpdate={onTodoUpdate}
          todo={todo}
          onTodoDelete={onTodoDelete}
          isProcessing={isProcessing.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProcessing
        />
      )}
    </section>
  );
};
