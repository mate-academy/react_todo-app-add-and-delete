import { useEffect, useRef } from 'react';

type Props = {
  title: string,
  setTitle: (value: string) => void,
  onSubmit: () => void,
  statusResponse: boolean,
};

export const TodoForm: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  statusResponse,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [statusResponse]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={statusResponse}
      />
    </form>
  );
};
