/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useState, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  errorMessageHandler: (message: string) => void;
};

export const ErrorNotification: FC<Props> = ({
  errorMessage,
  errorMessageHandler,
}) => {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosed(true);
      errorMessageHandler('');
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [isClosed]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isClosed },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsClosed(true)}
      />

      {errorMessage}
    </div>
  );
};
