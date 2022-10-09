import { RefObject, useEffect, useState } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  setErrorMessage: (error: string) => void,
  isAdding:boolean,
  onAddTodo: (str: string) => void,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  setErrorMessage,
  isAdding,
  onAddTodo,
}) => {
  const [inputTitle, setInputTitle] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputTitle.trim().length) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    await onAddTodo(inputTitle);
    setInputTitle('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle-all-button"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTitle}
          onChange={handleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
