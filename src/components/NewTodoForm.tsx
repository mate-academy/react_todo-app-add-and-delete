import React, { FormEvent, useEffect, useState } from 'react';

type Props = {
  onSubmit: (title: string) => Promise<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodoForm: React.FC<Props> = ({ onSubmit, inputRef }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, inputRef]);

const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  setIsSubmitting(true);

  const isSuccess = await onSubmit(title);

  if (isSuccess) {
    setTitle('');
  }

  setIsSubmitting(false);
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
      disabled={isSubmitting}
      onChange={event => setTitle(event.target.value)}
    />
  </form>
);
};
