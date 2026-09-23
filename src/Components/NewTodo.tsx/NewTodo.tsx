import { useEffect, useRef, useState } from 'react';

type Props = {
  disableInput: boolean;
  handleNewTodo: (value: string) => Promise<boolean>;
  formFocus: boolean;
  setFormFocus: () => void;
};

export const NewTodo: React.FC<Props> = ({
  handleNewTodo,
  disableInput,
  formFocus,
  setFormFocus,
}) => {
  const [title, setTitle] = useState('');
  const inputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputElement.current?.focus();
  }, [formFocus]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputElement.current) {
      return;
    }

    let successfullCompletion;

    await handleNewTodo(title.trim()).then(
      value => (successfullCompletion = value),
    );

    if (successfullCompletion) {
      if (inputElement.current) {
        setTitle('');
      }
    }

    setFormFocus();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        ref={inputElement}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={title}
        disabled={disableInput}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
};
