import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
};

export const NewTodo: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  disabled,
}) => {
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  });

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={field}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
      />
    </form>
  );
};
