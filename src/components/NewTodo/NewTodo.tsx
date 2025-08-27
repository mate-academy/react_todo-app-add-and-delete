import { useEffect } from 'react';

type Props = {
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  onCreate: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodo: React.FC<Props> = ({
  value,
  disabled = false,
  onChange,
  onCreate,
  inputRef,
}) => {
  // keep focused by default
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);
  // re-focus after disabled -> enabled
  useEffect(() => {
    if (!disabled) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [disabled, inputRef]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(value); // do NOT clear here
  };

  return (
    <header className="header">
      <h1>todos</h1>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="todoapp__new-todo"
          data-cy="NewTodoField"
          placeholder="What needs to be done?"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
