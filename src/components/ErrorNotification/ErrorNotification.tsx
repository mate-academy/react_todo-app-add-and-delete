import React, { useEffect } from 'react';
import { IsError } from '../../types/IsError';

interface Props {
  isError: IsError,
  setIsError: (IsError: IsError) => void,
  isErrorDefault: IsError,
}

export const ErrorNotification: React.FC<Props> = ({
  isError,
  setIsError,
  isErrorDefault,
}) => {
  const error = Object.entries(isError);
  const errorName = error.find(el => el[1] === true);
  const justErrorName = errorName && errorName[0].slice(0, -5);

  const handleClose = () => {
    setIsError(isErrorDefault);
  };

  useEffect(() => {
    const timeoutID = setTimeout(() => setIsError(isErrorDefault), 2000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Mute volume"
        onClick={handleClose}
      />

      {(errorName && !isError.emptyTitleError) && `Unable to ${justErrorName} a todo`}

      {isError.emptyTitleError && 'Title can\'t be empty'}

    </div>
  );
};
