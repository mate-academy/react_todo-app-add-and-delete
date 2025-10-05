import React, { useState } from 'react';

type Props = {
  onCreate: (title: string) => Promise<boolean>;
  fieldRef: React.RefObject<HTMLInputElement>;
  disabled: boolean;
};

export const NewTodoForm: React.FC<Props> = ({
  onCreate,
  fieldRef,
  disabled,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const success = await onCreate(title);

    if (success) {
      setTitle('');
    }
    // if (title.trim()) {
    //   onCreate(title.trim())
    //     .then(() => setTitle(''))
    //     .catch(e => console.error(e));
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={disabled}
        ref={fieldRef}
      />
    </form>
  );
};
