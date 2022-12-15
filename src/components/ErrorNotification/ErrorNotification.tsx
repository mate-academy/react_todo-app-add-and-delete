/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';

type Props = {
  isError: boolean
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  typeError: string
};

export const ErrorNotification: React.FC<Props> = ({
  isError,
  onSetIsError,
  typeError,
}) => {
  useEffect(() => {
    onSetIsError(isError);
    if (isError) {
      setTimeout(() => {
        onSetIsError(true);
      }, 3000);
    }
  }, [isError]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={isError}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetIsError(true)}
      />

      {!isError && <>{typeError}</>}
    </div>
  );
};
