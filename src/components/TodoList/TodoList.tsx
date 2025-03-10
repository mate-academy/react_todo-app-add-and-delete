import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTodo,
  tempTodo,
  deletingTodoIds,
}) => {
  const handleToggle = () => {};

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={deleteTodo}
          isTemporary={tempTodo?.id === todo.id}
          isDeleting={deletingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && !deletingTodoIds.includes(tempTodo.id) && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onToggle={() => {}}
          onDelete={() => {}}
          isTemporary={true}
        />
      )}
    </section>
  );
};
