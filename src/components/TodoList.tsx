import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  onDeleteTodo: (id: number) => void;
  isAddingTodo: boolean;
  onUpdateStatus: (id: number, completed: boolean) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deletingTodoId,
  tempTodo,
  onDeleteTodo,
  isAddingTodo,
  onUpdateStatus,
 }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
        key={todo.id}
        todo={todo}
        deletingTodoId={deletingTodoId}
        onDeleteTodo={onDeleteTodo}
        onUpdateStatus={onUpdateStatus}
        />
      ))}

       {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          deletingTodoId={deletingTodoId}
          isAddingTodo={isAddingTodo}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </section>
  );
};
