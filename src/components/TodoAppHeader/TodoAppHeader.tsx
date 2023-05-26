import { FormEvent } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  activeTodosCount: number;
  todoInputValue: string;
  isAddDisabled: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const TodoAppHeader: React.FC<Props> = ({
  activeTodosCount,
  todoInputValue,
  isAddDisabled,
  onInputChange,
  onSubmit,
}) => (
  <header className="todoapp__header">
    {activeTodosCount > 0 && (
      <button
        type="button"
        className="todoapp__toggle-all active"
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isAddDisabled}
        value={todoInputValue}
        onChange={(event) => onInputChange(event.target.value)}
      />
    </form>
  </header>
);
