import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onAddTodo: (
    title: string,
    setIsSubmitting: (value: boolean) => void,
    resetForm: () => void,
  ) => void;
  setErrorMessage: (message: string | null) => void;
  focusInputRef?: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<Props> = ({ onAddTodo, setErrorMessage }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const resetForm = () => {
    setTitle('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    onAddTodo(title.trim(), setIsSubmitting, resetForm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isSubmitting}
      />
    </form>
  );
};
