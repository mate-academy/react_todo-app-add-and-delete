import React from 'react';

interface Props {
  title: string,
  onChange: (title: string) => void,
  onAdd: () => void;
  isLoading: boolean;
  onLoad: (status: boolean) => void;
}

export const TodoForm: React.FC<Props> = ({
  title,
  onChange,
  onAdd,
  isLoading,
  onLoad,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAdd();
    onLoad(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => onChange(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
