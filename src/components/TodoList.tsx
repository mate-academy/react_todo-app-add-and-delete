import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  editingTodoId: number | null;
  onUpdateTodo: (id: number, data: Partial<Omit<Todo, 'id'>>) => void;
  onDeleteTodo: (id: number) => void;
  onSetEditingId: (id: number | null) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  editingTodoId,
  onUpdateTodo,
  onDeleteTodo,
  onSetEditingId,
}) => {
  const todoListToRender = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoListToRender.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          isEditing={editingTodoId === todo.id}
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
          onSetEditingId={onSetEditingId}
        />
      ))}
    </section>
  );
};
