import React, { useState } from 'react';

type Props = {
  onAdd: (title: string) => Promise<boolean>;
  loading?: boolean;
  todoFieldRef: React.RefObject<HTMLInputElement>;
};

export const NewTodoForm: React.FC<Props> = ({
  onAdd,
  loading,
  todoFieldRef,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const isSuccess = await onAdd(title);

    if (isSuccess) {
      setTitle(''); // Czyścimy tylko przy sukcesie
    }
  };

  return (
    <form onSubmit={handleSubmit} data-cy="NewTodoForm">
      <input
        data-cy="NewTodoField"
        ref={todoFieldRef}
        type="text"
        className="todoapp__new-todo"
        value={title}
        onChange={event => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        disabled={loading}
      />
    </form>
  );
};
