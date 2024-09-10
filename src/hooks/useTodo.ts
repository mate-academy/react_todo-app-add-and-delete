import { useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type InputHook = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, data: Partial<Todo>) => Promise<void>;
};

export const useTodo = (input: InputHook) => {
  const { onDelete, onEdit, todo } = input;

  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = async () => {
    try {
      await onDelete(todo.id);
    } catch {
      // eslint-disable-next-line no-console
      console.log('Error deleting todo');
    }
  };

  const handleCompleted = async (completed: boolean) => {
    try {
      await onEdit(todo.id, { completed });
    } catch {
      // eslint-disable-next-line no-console
      console.log('Error editing todo');
    }
  };

  const handleTitleEdit = async (title: string) => {
    const formattedTitle = title.trim();

    if (!formattedTitle) {
      return handleDelete();
    }

    if (title === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await onEdit(todo.id, { title: formattedTitle });

      setIsEditing(false);
    } catch {
      // eslint-disable-next-line no-console
      inputRef.current?.focus();
    }
  };

  return {
    isEditing,
    inputRef,
    handleDelete,
    handleCompleted,
    handleTitleEdit,
    setIsEditing,
  };
};
