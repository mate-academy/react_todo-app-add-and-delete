import React, { useCallback } from 'react';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: () => void;
  statusResponce: boolean;
};

export const NewTodo: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  statusResponce,
}) => {
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        ref={input => input && input.focus()}
        disabled={statusResponce}
      />
    </form>
  );
};
