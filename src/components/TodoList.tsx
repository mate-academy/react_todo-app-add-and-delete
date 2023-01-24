import React from 'react';
import { Todo } from '../types/Todo';
import { TodoDetails } from './TodoDetails';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  newTodo: Todo | null,
  isLoading: boolean,
  deleteTodo: (todoId: number) => void,
  deletedTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  newTodo,
  isLoading,
  deleteTodo,
  deletedTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoDetails
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isActive={isLoading}
          deletedTodoIds={deletedTodoIds}
        />
      ))}

      {newTodo && (
        <TodoDetails
          todo={newTodo}
          deleteTodo={deleteTodo}
          isActive={isAdding}
          deletedTodoIds={deletedTodoIds}
        />
      )}
    </section>
  );
};
