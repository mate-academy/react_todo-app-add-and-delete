import { FC, FormEvent } from 'react';

type Props = {
  handleFormSubmit: (x: FormEvent<HTMLFormElement>) => void,
  inputValue: string,
  setInputValue: (x: string) => void,
  inputIsDisabled: boolean,
};

export const TodoInput: FC<Props> = ({
  handleFormSubmit, inputValue, setInputValue, inputIsDisabled,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          disabled={inputIsDisabled}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
