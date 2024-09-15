/* eslint-disable max-len */
import classNames from 'classnames';
import { useEffect } from 'react';

import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  errorNotification: ErrorMessages | null;
  setErrorNotification: () => void;
};

export const ErrorNotification = ({
  errorNotification,
  setErrorNotification,
}: Props) => {
  useEffect(() => {
    setTimeout(() => setErrorNotification(), 3000);
  }, [errorNotification, setErrorNotification]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorNotification,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={setErrorNotification}
      />
      {errorNotification}
    </div>
  );
};
