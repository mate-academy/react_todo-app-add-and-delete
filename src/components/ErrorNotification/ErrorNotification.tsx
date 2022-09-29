import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  isErrorNotification: boolean,
  setIsErrorNotification: (errorNotification: boolean) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  isErrorNotification,
  setIsErrorNotification,
}) => {
  if (isErrorNotification) {
    setTimeout(() => {
      setIsErrorNotification(false);
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isErrorNotification },
      )}
    >
      <button
        aria-label="delete"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsErrorNotification(false)}
      />
      {errorMessage}
    </div>
  );
};
