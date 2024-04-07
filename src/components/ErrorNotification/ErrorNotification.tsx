import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { StateContext } from '../../store/Store';

export const ErrorNotification = () => {
  const { status } = useContext(StateContext);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'SUCCESS') {
      setErrorMessage(status);
    }

    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [status]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
