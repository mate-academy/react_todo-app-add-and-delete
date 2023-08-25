import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../Enum/ErrorMessage';
import { useTodo } from '../Hooks/UseTodo';

type Props = {
  errorVisibility: boolean,
  setErrorVisibility: React.Dispatch<React.SetStateAction<boolean>>
};

export const ErrorNotification: React.FC<Props> = ({
  errorVisibility,
  setErrorVisibility,
}) => {
  const { isError, setIsError } = useTodo();

  const closeErrorMessage = () => {
    setErrorVisibility(false);
    setIsError(ErrorMessage.NONE);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorVisibility(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorVisibility]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorVisibility },
    )}
    >
      <button
        type="button"
        aria-label="close ErrorMessage"
        className="delete"
        onClick={closeErrorMessage}
      />
      {isError}
    </div>
  );
};
