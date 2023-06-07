import React, {
  useContext, useState, MutableRefObject,
} from 'react';
import classNames from 'classnames';
import { ErrorContext } from '../context/ErrorContextProvider';
import { ErrorValues } from '../types/ErrorValues';

type Props = {
  leftTodosCount: number,
  handleAddingTodos: (value: string) => void,
  inputHeaderRef: MutableRefObject<HTMLInputElement>,
};

export const Header: React.FC<Props> = ({
  leftTodosCount,
  handleAddingTodos,
  inputHeaderRef,
}) => {
  const [inputValue, setInputValue] = useState('');
  const errorContext = useContext(ErrorContext);
  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim().length === 0) {
      errorContext.setErrorMessage(ErrorValues.Validation);

      return;
    }

    handleAddingTodos(inputValue);
    setInputValue('');
    // eslint-disable-next-line no-param-reassign
    inputHeaderRef.current.disabled = true;
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    errorContext.setHideError(true);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="button"
        className={classNames('todoapp__toggle-all',
          { active: leftTodosCount > 0 })}
      />
      <form
        onSubmit={handleSubmitForm}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleOnChange}
          ref={inputHeaderRef}
        />
      </form>
    </header>
  );
};
