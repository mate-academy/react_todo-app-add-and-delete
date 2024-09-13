import { useEffect, useRef, useState } from 'react';

interface Props {
  onSumbit: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  isTitleClear: boolean;
  onSetIsTitleClear: (setIsTitleClear: boolean) => void;
}

export const Header: React.FC<Props> = ({
  onSumbit,
  isSubmitting,
  isTitleClear,
  onSetIsTitleClear,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    if (isTitleClear) {
      setValue('');
      onSetIsTitleClear(false);
    }
  }, [isTitleClear, onSetIsTitleClear]);

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form>
        <input
          onKeyDown={onSumbit}
          onChange={handleInputOnChange}
          disabled={isSubmitting}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
