import { forwardRef } from 'react';
import { Form } from '../Form/Form';

type Props = {
  query: string;
  onInput: (v: string) => void;
  onAdd: () => void;
  isLoading: boolean;
};

export const Header = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { query, onInput, onAdd, isLoading } = props;

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <Form
        query={query}
        onInput={onInput}
        onAdd={onAdd}
        ref={ref}
        isLoading={isLoading}
      />
    </header>
  );
});

Header.displayName = 'Header';
