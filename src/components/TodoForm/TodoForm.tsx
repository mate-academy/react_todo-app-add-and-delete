import React, { useEffect, useRef } from 'react';

interface Props {
  title: string,
  onSubmit: (event: React.FormEvent) => void,
  isAdding: boolean,
  onTitleChange: (title: string) => void,
}

export const TodoForm: React.FC<Props> = (
  {
    title,
    onSubmit,
    isAdding,
    onTitleChange,
  },
) => {
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
        onChange={(event) => onTitleChange(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
