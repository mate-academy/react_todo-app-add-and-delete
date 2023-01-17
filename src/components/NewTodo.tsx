import { FC, memo, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  isAdding: boolean
  onFocus: React.Dispatch<React.SetStateAction<boolean>>,
  onFormSubmit: (title: string) => void,
}

export const NewTodo: FC<Props> = memo(
  ({
    newTodoField,
    isAdding,
    onFocus,
    onFormSubmit,
  }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      onFormSubmit(inputValue);
      setInputValue('');
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.currentTarget.value.trim());
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={inputValue}
            disabled={isAdding}
            onFocus={() => onFocus(true)}
            onChange={handleInput}
          />
        </form>
      </header>
    );
  },
);
