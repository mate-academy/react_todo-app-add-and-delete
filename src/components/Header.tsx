/* eslint-disable jsx-a11y/control-has-associated-label */
import { FormEvent } from 'react';

type Props = {
  query: string;
  onChange(value: string): void;
  onSubmit(e: FormEvent<HTMLFormElement>): void;
  isLoading: boolean
};

export const Header: React.FC<Props> = ({
  query,
  onChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={onSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
