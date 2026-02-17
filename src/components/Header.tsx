import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

type Props = {
  onAdd: (title: string) => Promise<boolean>;
  disabled: boolean;
};

export type HeaderRef = {
  focus: () => void;
};

export const Header = forwardRef<HeaderRef, Props>(
  ({ onAdd, disabled }, ref) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const success = await onAdd(title);

      if (success) {
        setTitle('');
      }
    };

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={disabled}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
