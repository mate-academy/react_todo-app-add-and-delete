/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';

type Props = {
  onTodoAdd: (title: string) => void;
  setError: (error: string) => void;
};

export const Header: React.FC<Props> = ({
  onTodoAdd,
  setError,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle) {
      setError("Title can't be empty");
    }

    setIsFormDisabled(true);

    await onTodoAdd(newTitle);

    setNewTitle('');
    setIsFormDisabled(false);
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleTitleChange}
          disabled={isFormDisabled}
        />
      </form>
    </header>
  );
};
