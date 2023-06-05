import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  visibleTodos: Todo[];
  onDeleteTodo(id: number): void,
  isUpdating: boolean,
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  onDeleteTodo,
  isUpdating,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isUpdating={isUpdating}
        />
      ))}
    </section>
  );
};
