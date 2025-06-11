import React from 'react';

interface TodoEditProps {
  handleEditedTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
  editedTitle: string;
}

export const TodoEdit: React.FC<TodoEditProps> = ({
  handleEditedTitle,
  handleKeyDown,
  handleInputBlur,
  editedTitle,
}) => {
  return (
    /* This form is shown instead of the title and remove button */
    <form>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        onChange={handleEditedTitle}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        autoFocus
      />
    </form>
  );
};
