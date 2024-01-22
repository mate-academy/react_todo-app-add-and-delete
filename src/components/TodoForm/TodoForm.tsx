import { useEffect, useRef } from 'react';

type Props = {
  title: string,
  setTitle: (val: string) => void;
  onSubmit: () => void;
  statusResponce: boolean;
};

export const TodoForm: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  statusResponce,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [statusResponce]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        data-cy="NewTodoField"
        ref={inputField}
        type="text"
        className="todoapp__new-todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={statusResponce}
      />
    </form>
  );
};
