import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './todoItem';

interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  editingTodoId: number | null;
  editingTodoTitle: string;
  loading: boolean;
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
  loading,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onUpdateTodo,
  onEditingTodoTitleChange,
  onCancelEdit,
}) => {
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return false;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editingTodoId={editingTodoId}
          editingTodoTitle={editingTodoTitle}
          loading={loading}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          onEditTodo={onEditTodo}
          onUpdateTodo={onUpdateTodo}
          onEditingTodoTitleChange={onEditingTodoTitleChange}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </section>
  );
};
