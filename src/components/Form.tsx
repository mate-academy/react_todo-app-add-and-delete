import React, { useState } from 'react';

type Props = {
  onSubmit: (title: string) => Promise<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Form: React.FC<Props> = ({ onSubmit, inputRef }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        setLoading(true);
        onSubmit(title)
          .then(status => {
            if (status) {
              setTitle('');
            }
          })
          .finally(() => {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 0);
          });
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        disabled={loading}
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
};
