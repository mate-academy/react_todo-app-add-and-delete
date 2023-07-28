import React from 'react';

type Props = {
  onSubmit: (title: string) => {},
  title: string,
  setTitle: (title: string) => void,
};

export const AddForm: React.FC<Props> = ({ onSubmit, title, setTitle }) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(title);
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
      />
    </form>
  );
};
