import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

interface Props {
  errorText: Error;
}

export const ErrorNotification: React.FC<Props> = ({ errorText }) => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (errorText !== Error.Default) {
      setHidden(false);
    }

    const timer = setTimeout(() => {
      setHidden(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorText]);

  return !hidden ? (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
        )}
      >
        {errorText}
        <button
          aria-label="HideErrorButton"
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHidden(false)}
        />
      </div>
    </>
  ) : (
    null
  );
};
