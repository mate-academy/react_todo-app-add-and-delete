import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onSubmit: (value: string) => void;
  isAdding: boolean;
};

const Form: React.FC<Props> = ({ onSubmit, isAdding }) => {
  const [inputValue, setInputValue] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isAdding) {
      setInputValue('');
    }
  }, [isAdding]);

  const submitHandler = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  const inputChangeHandler = (e:React.ChangeEvent) => {
    const inputField = e.target as HTMLInputElement;
    const currentValue = inputField.value;

    setInputValue(currentValue);
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={inputChangeHandler}
        disabled={isAdding}
      />
    </form>
  );
};

export default Form;
