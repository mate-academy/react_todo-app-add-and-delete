import { useEffect, useRef, useState } from 'react';

interface NewTodoProps {
  onAdd: (title: string) => Promise<void>;
  disabled?: boolean;
  onFocusRef?: (focusFn: () => void) => void;
}

export const NewTodo: React.FC<NewTodoProps> = ({
  onAdd,
  disabled = false,
  onFocusRef,
}) => {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onFocusRef) {
      onFocusRef(() => inputRef.current?.focus());
    }
  }, [onFocusRef]);

  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      await onAdd(trimmedTitle);

      return;
    }

    setSubmitting(true);
    try {
      await onAdd(trimmedTitle);
      setTitle('');
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    } catch (e) {
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }

    setSubmitting(false);
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
        onChange={event => setTitle(event.target.value)}
        disabled={disabled || submitting}
      />
    </form>
  );
};
