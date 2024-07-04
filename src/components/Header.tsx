/* eslint-disable react/display-name */
import { ChangeEvent, RefObject, memo } from 'react';

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  value: string;
  isLoading: boolean;
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Header = memo((props: Props) => {
  const { addTodo, inputRef, onChange, value, isLoading } = props;

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={value}
          onChange={onChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
