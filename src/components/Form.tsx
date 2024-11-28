import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onCreateTodo: (todoTitle: string) => Promise<void>;
  isLoading: boolean;
  setErrorMessage: (message: string) => void;
};

const Form: React.FC<Props> = ({
  onCreateTodo,
  isLoading,
  setErrorMessage,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && !isLoading) {
      titleField.current.focus();
    }
  }, [isLoading]);

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todoTitle.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    onCreateTodo(todoTitle).then(() => setTodoTitle(''));
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        disabled={isLoading}
        ref={titleField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleTitleInput}
      />
    </form>
  );
};

export default Form;
