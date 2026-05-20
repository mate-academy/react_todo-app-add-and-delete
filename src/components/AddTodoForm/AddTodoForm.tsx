import { ChangeEvent, FormEvent, RefObject, useState } from 'react';

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  onAddTodo: (title: string) => Promise<void>;
  onError: (message: string) => void;
}

export const AddTodoForm = ({ inputRef, onAddTodo, onError }: Props) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimStart().replace(/\s{2,}/g, ' ');

    setTitle(value);
  };

  const handleSumbitAddTodo = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trimEnd();

    if (trimmedTitle === '') {
      onError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    onAddTodo(trimmedTitle)
      .then(() => setTitle(''))
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  return (
    <form onSubmit={handleSumbitAddTodo}>
      <input
        autoFocus
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        disabled={isSubmitting}
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChangeInput}
      />
    </form>
  );
};
