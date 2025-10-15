import { FC } from 'react';

interface Props {
  isToggleAllVisible: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  inputDisable: boolean;
  todoTitle: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
}

export const Header: FC<Props> = ({
  isToggleAllVisible,
  inputRef,
  inputDisable,
  todoTitle,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {isToggleAllVisible && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form method="POST" onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          name={'title'}
          value={todoTitle}
          onChange={handleInputChange}
          disabled={inputDisable}
          autoFocus
        />
      </form>
    </header>
  );
};
