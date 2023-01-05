import { FC, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  onFocus: React.Dispatch<React.SetStateAction<boolean>>,
  onFormSubmit: (title: string) => void,
  isAdding: boolean
}

export const NewTodo: FC<Props> = ({
  newTodoField,
  onFocus,
  onFormSubmit,
  isAdding,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onFormSubmit(inputValue);
    setInputValue('');
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
          onFocus={() => onFocus(true)}
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value.trim())}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
