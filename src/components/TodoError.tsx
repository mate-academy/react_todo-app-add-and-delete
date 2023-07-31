import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Error } from '../types/Error';
import { wait } from '../utils/fetchClient';

type Props = {
  errorMessage: Error,
  setErrorMessage: (error: Error) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [hasError, setHasError] = useState(true);

  useEffect(() => {
    wait(3000)
      .then(() => setHasError(false))
      .then(() => wait(3000))
      .then(() => setErrorMessage(Error.none));
  }, []);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !hasError,
      },
    )}
    >
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Error.none)}
      />

      {errorMessage}
    </div>
  );
};
