import React, { useEffect, useRef } from 'react';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  onTitleChange: (title: string) => void;
  isAdding: boolean;
};

export const NewTodo: React.FC<Props> = ({
  onSubmit,
  title,
  onTitleChange,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => onTitleChange(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
