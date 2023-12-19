import React, { useState, useEffect, useRef } from 'react';

type Props = {
  onSubmit: (value: string) => Promise<string>;
};

export const Input: React.FC<Props> = ({ onSubmit }) => {
  const [newTodoField, setNewTodoField] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const handleNewTodoField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setNewTodoField(value.replace(/\s/g, ' '));
  };

  const handleSubmit = () => {
    setIsDisabled(true);
    onSubmit(newTodoField).then(res => {
      if (res === 'fullfield') {
        setIsDisabled(false);
        setNewTodoField('');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }

      if (res === 'error') {
        setIsDisabled(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
        aria-label="toggle all button"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => handleNewTodoField(e)}
          value={newTodoField}
          disabled={isDisabled}
          ref={inputRef}
        />
      </form>
    </>
  );
};
