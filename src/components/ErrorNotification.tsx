import React from 'react';

export type Props = {
  setErrorText: (arg: string) => void,
  errorText: string
};

export const ErrorNotification: React.FC<Props> = ({
  setErrorText,
  errorText,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorText('')}
      />

      {errorText}
    </div>
  );
};
