import React, { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem_temp';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: Filter;
  editingTodoId: number | null;
  editingTodoTitle: string;
  loading: boolean;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onEditTodo: (todo: Todo) => void;
  onUpdateTodo: (event: React.FormEvent, todoId: number) => void;
  onEditingTodoTitleChange: (title: string) => void;
  onCancelEdit: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
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
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Filter.All) {
        return true;
      }

      if (filter === Filter.Active) {
        return !todo.completed;
      }

      if (filter === Filter.Completed) {
        return todo.completed;
      }

      return false;
    });
  }, [todos, filter]);

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
          onUpdateTodo={(e: React.FormEvent) => onUpdateTodo(e, todo.id)}
          onEditingTodoTitleChange={onEditingTodoTitleChange}
          onCancelEdit={onCancelEdit}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={`temp-${tempTodo.id}`}
          todo={tempTodo}
          editingTodoId={editingTodoId}
          editingTodoTitle={editingTodoTitle}
          loading={true}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          onEditTodo={onEditTodo}
          onUpdateTodo={(e: React.FormEvent) => onUpdateTodo(e, tempTodo.id)}
          onEditingTodoTitleChange={onEditingTodoTitleChange}
          onCancelEdit={onCancelEdit}
        />
      )}
    </section>
  );
};
