/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onInputChange: (newTitle: string) => void,
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  isInputFieldDisabled: boolean,
};

export const SubmitForm: React.FC<Props> = ({
  todos,
  onInputChange,
  inputValue,
  setInputValue,
  isInputFieldDisabled,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const inputReference = useRef(null);

  const setInputFocus = () => {
    if (!isInputFieldDisabled && inputReference?.current) {
      const input: HTMLInputElement = inputReference.current;

      input.focus();
    }
  };

  // useEffect(() => {
  //   if (isDisabled && !inputValue) {
  //     setIsdisabled(false);
  //   }

  //   setInputFocus();
  // }, [inputValue]);

  useEffect(() => {
    setInputFocus();
  }, [inputValue, isInputFieldDisabled, todos]);

  const handleEnterKeyPress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (inputValue.trim().length) {
    //   setIsdisabled(true);
    // }

    onInputChange(inputValue);
  };

  return (
    <form
      onSubmit={handleEnterKeyPress}
    >
      <input
        ref={inputReference}
        disabled={isInputFieldDisabled}
        value={inputValue}
        onChange={handleTitleChange}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
