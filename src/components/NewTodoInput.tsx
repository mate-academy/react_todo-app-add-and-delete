import { memo, useState, useRef, useEffect } from 'react';
import { ErrorType } from '../types/ErrorType';

interface Props {
  onSubmit: (title: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  isDisabled: boolean;
  focusTrigger: number;
}

export const NewTodoInput: React.FC<Props> = memo(function NewTodoInput({
  onSubmit,
  isDisabled,
  setErrorMessage,
  focusTrigger,
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled, focusTrigger]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = inputValue.trim();

    if (trimmedTitle === '') {
      setErrorMessage(ErrorType.EMPTY_TITLE);
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setErrorMessage(null);

      try {
        await onSubmit(trimmedTitle);
        setInputValue('');
      } catch (error) {}
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        autoFocus
        disabled={isDisabled}
      />
    </form>
  );
});
