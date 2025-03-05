import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  editingTodoId: number | null;
  editingTodoTitle: string;
  loadingTodos: number[];
  tempTodoId: number | null;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onEditTodo: (todo: Todo) => void;
  onUpdateTodo: (event: React.FormEvent) => void;
  onEditingTodoTitleChange: (title: string) => void;
  onCancelEdit: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  editingTodoId,
  editingTodoTitle,
  loadingTodos,
  tempTodoId,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onUpdateTodo,
  onEditingTodoTitleChange,
  onCancelEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todo-list">
        {todos
          .filter(todo => {
            if (filter === 'active') {
              return !todo.completed;
            }

            if (filter === 'completed') {
              return todo.completed;
            }

            return true;
          })
          .map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              editingTodoId={editingTodoId}
              editingTodoTitle={editingTodoTitle}
              isLoading={loadingTodos.includes(todo.id)}
              onToggleTodo={onToggleTodo}
              onDeleteTodo={onDeleteTodo}
              isTemporary={todo.id === tempTodoId}
              onEditTodo={onEditTodo}
              onUpdateTodo={onUpdateTodo}
              onEditingTodoTitleChange={onEditingTodoTitleChange}
              onCancelEdit={onCancelEdit}
            />
          ))}
      </ul>
    </section>
  );
};
