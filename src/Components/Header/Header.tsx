import { FC, useEffect, useState } from 'react';
import { Error, ErrorMessage } from '../../types/Error';

type Props = {
  onEmptyForm: React.Dispatch<React.SetStateAction<Error>>,
  isDisabled: boolean,
  onAdd: (todo: string) => void,
  statusPost: boolean,
};

const Header: FC<Props> = ({
  onEmptyForm,
  isDisabled,
  onAdd,
  statusPost,
}) => {
  const [inputValue, setInputValue] = useState('');

  const hendlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setInputValue(value);
  };

  const hendlerSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue === '') {
      onEmptyForm({
        status: true,
        message: ErrorMessage.EMPTYFORM,
      });

      return;
    }

    onAdd(inputValue);
  };

  useEffect(() => {
    if (statusPost) {
      setInputValue('');
    }
  }, [statusPost]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={hendlerSubmitForm}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={hendlerInput}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};

export default Header;
