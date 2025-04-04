import React, { useState, useEffect, useRef } from 'react';

interface Props {
  title: string;
  onTitleChange: (newTitle: string) => Promise<void>;
  onCancel: () => void;
}

export const TodoEditForm: React.FC<Props> = ({
  title,
  onTitleChange,
  onCancel,
}) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onTitleChange(editedTitle);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancel();
      setEditedTitle(title);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        onChange={e => setEditedTitle(e.target.value)}
        onBlur={() => onTitleChange(editedTitle)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
    </form>
  );
};
