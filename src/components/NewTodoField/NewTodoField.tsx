import React, { useEffect, useRef } from 'react';

type Props = {
  title: string,
  onTitleChange: (title: string) => void,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
};

export const NewTodoField: React.FC<Props> = ({
  title,
  onSubmit,
  onTitleChange,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
      />
    </form>
  );
};
