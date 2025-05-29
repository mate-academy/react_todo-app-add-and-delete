import React from 'react';
import { TodoItem } from './todoitem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  savingIds: number[];
  editingId: number | null;
  editingTitle: string;
  onToggleTodo: (todo: Todo) => void;
  onRemoveTodo: (id: number) => void;
  onStartEdit: (todo: Todo) => void;
  onSaveEdit: () => void;
  setEditingTitle: (title: string) => void;
  tempTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  savingIds,
  editingId,
  editingTitle,
  onToggleTodo,
  onRemoveTodo,
  onStartEdit,
  onSaveEdit,
  setEditingTitle,
  tempTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isSaving = savingIds.includes(todo.id) || todo.id === tempTodoId;
        const isEditing = editingId === todo.id;

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSaving={isSaving}
            isEditing={isEditing}
            editingTitle={editingTitle}
            onToggle={() => onToggleTodo(todo)}
            onRemove={() => onRemoveTodo(todo.id)}
            onStartEdit={() => onStartEdit(todo)}
            onSaveEdit={onSaveEdit}
            setEditingTitle={setEditingTitle}
          />
        );
      })}
    </section>
  );
};
