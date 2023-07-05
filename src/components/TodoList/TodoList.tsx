import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  visibleTodos: Todo[],
  loadingTodosId: number[],
  handleDeleteTodo: (todoId: number) => void
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  loadingTodosId,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          loadingTodosId={loadingTodosId}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </section>
  );
};
