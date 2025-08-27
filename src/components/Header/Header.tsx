import { Todo } from '../../types/Todo';
import { NotificationType } from '../../types/NotificationType';
import { useEffect, useState } from 'react';

type HeaderProps = {
  userID: number; // Added userID prop
  inputRef?: React.RefObject<HTMLInputElement>; // Optional ref for input focus
  onSubmit: (todo: Todo) => Promise<void>; // Updated to accept full Todo type
  setError: (message: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  userID,
  inputRef,
  onSubmit,
  setError,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, inputRef]);

  const reset = () => {
    setNewTodoTitle('');
    inputRef?.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedTitle = newTodoTitle.trim(); // Remove trailing spaces only on submit

    if (trimmedTitle.length === 0) {
      setError(NotificationType.TITLE);

      return;
    }

    setIsSubmitting(true);
    onSubmit({ title: trimmedTitle, completed: false, userId: userID, id: 0 })
      .then(reset)
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const cleanedTitle = event.target.value.replace(
      /[^a-zA-Zа-яА-ЯёЁґҐєЄіІїЇ0-9 ]/g,
      '',
    );

    setNewTodoTitle(cleanedTitle);
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={isSubmitting}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
