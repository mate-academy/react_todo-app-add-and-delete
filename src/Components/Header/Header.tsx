import classNames from 'classnames';
import { useState } from 'react';

interface HeaderProps {
  active: number;
  onChange: (value: string) => Promise<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header = ({ active, onChange, inputRef }: HeaderProps) => {
  const [listValue, setListValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAllActive = !active ? true : false;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalValue = listValue.trim();

    setIsSubmitting(true);

    onChange(normalValue)
      .then(isSuccess => {
        if (isSuccess) {
          setListValue('');
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames(`todoapp__toggle-all `, { active: isAllActive })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={listValue}
          onChange={event => setListValue(event.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};
