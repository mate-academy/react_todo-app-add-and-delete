import React from 'react';

type Props = {
  onFormSubmit: () => void,
  title: string,
  onTitleChange: (newTitle: string) => void,
};

export const AddTodoForm: React.FC<Props> = ({
  onFormSubmit,
  title,
  onTitleChange,
}) => {
  return (
    <form
      onSubmit={onFormSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
      />
    </form>
  );
};
