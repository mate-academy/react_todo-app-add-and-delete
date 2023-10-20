import { useEffect, useRef } from 'react';

type Props = {
  title: string,
  setTitle: (val: string) => void;
  addTodo: () => void;
  statusResponce: boolean;
};

export const TodoForm: React.FC<Props> = ({
  title,
  setTitle,
  addTodo,
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

    addTodo();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        ref={inputField}
        value={title}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={e => setTitle(e.target.value)}
        disabled={statusResponce}
      />
    </form>
  );
};
