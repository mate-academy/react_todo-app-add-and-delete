import React from 'react';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  // Data
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];

  // Editing State
  editingTodoId: number | null;
  tempTitle: string;
  setTempTitle: (query: string) => void;

  // Actions
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => void;
  onEdit: (todo: Todo) => void;
  onCancel: () => void;
  onSave: (todoId: number) => void;
  onSubmit: (event: React.FormEvent, todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  editingTodoId,
  tempTitle,
  setTempTitle,
  onDelete,
  onUpdate,
  onEdit,
  onCancel,
  onSave,
  onSubmit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          // Data
          todo={todo}
          // State
          isEditing={editingTodoId === todo.id}
          isLoading={processingIds.includes(todo.id)}
          tempTitle={tempTitle}
          // Handlers
          onChange={e => setTempTitle(e.target.value)}
          onEdit={onEdit}
          onSubmit={e => onSubmit(e, todo.id)}
          onCancel={onCancel}
          onSave={() => onSave(todo.id)}
          onToggle={() => onUpdate(todo.id, { completed: !todo.completed })}
          onDelete={() => onDelete(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          isEditing={false}
          isLoading={true}
          tempTitle=""
          onChange={() => {}}
          onEdit={() => {}}
          onSubmit={() => {}}
          onCancel={() => {}}
          onSave={() => {}}
          onToggle={() => {}}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
