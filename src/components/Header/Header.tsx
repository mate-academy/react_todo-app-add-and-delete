import React, { useEffect, useRef, Dispatch, SetStateAction } from 'react';
import cn from 'classnames';

interface Props {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputChange: string;
  loadingTodoIds: number[];
  focusOnChange: boolean;
  onInputChange: Dispatch<SetStateAction<string>>;
}

export const Header: React.FC<Props> = ({
  handleSubmit,
  inputChange,
  loadingTodoIds,
  focusOnChange,
  onInputChange,
}) => {
  const todoInputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoInputField.current) {
      todoInputField.current.focus();
    }
  }, [focusOnChange]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: false })}
        data-cy="ToggleAllButton"
        disabled
      />

      <form onSubmit={handleSubmit}>
        <input
          disabled={loadingTodoIds.includes(0)}
          ref={todoInputField}
          value={inputChange}
          onChange={event => onInputChange(event.target.value.trimStart())}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
