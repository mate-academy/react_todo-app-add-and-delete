import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  isErrorMessage: boolean,
  setIsErrorMessage: (value: boolean) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  isErrorMessage, setIsErrorMessage,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsErrorMessage(false);
    }, 3000);
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isPressed || !isErrorMessage },
      )}
    >
      <button
        aria-label="delete"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsPressed(true)}
      />
      {isErrorMessage && ('Unable to add a todo')}

      <br />
    </div>
  );
};
