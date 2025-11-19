import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  isSubmiting: boolean;
  onSubmit: (title: string) => Promise<void>;
  onError: (message: string) => void;
  isFocus: boolean;
}

export const TodoForm: FC<Props> = React.memo(function TodoForm({
  onSubmit,
  onError,
  isSubmiting,
  isFocus,
}) {
  const [value, setValue] = useState('');

  const titleInput = useRef<HTMLInputElement | null>(null);

  const handleInputFocus = useCallback(() => {
    titleInput.current?.focus();
  }, []);

  useEffect(() => {
    handleInputFocus();
  }, [handleInputFocus]);

  useEffect(() => {
    if (!isSubmiting) {
      handleInputFocus();
    }
  }, [isSubmiting, handleInputFocus]);

  useEffect(() => {
    if (isFocus) {
      handleInputFocus();
    }
  }, [isFocus, handleInputFocus]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const title = value.trim();

      if (title === '') {
        onError('Title should not be empty');

        return;
      }

      onSubmit(title).then(() => {
        setValue('');
      });
    },
    [onSubmit, onError, value],
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={e => setValue(e.target.value)}
        ref={titleInput}
        disabled={isSubmiting}
      />
    </form>
  );
});
