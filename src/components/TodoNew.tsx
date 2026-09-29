import React from 'react';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  onAdd: (title: string) => void;
  disabled: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
};

export const TodoNew: React.FC<Props> = ({
  title,
  setTitle,
  onAdd,
  disabled,
  inputRef,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={disabled}
        autoFocus
      />
    </form>
  );
};
