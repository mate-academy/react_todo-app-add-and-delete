/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';

import { ErrorNames } from '../../types/ErrorNames';

type Props = {
  errorText: string,
  setHasError: (errorName: ErrorNames) => void,
};

export const Notification: React.FC<Props> = ({
  errorText,
  setHasError,
}) => {
  useEffect(() => {
    const unmountTimer = setTimeout(() => {
      setHasError(ErrorNames.None);
    }, 3000);

    return () => clearTimeout(unmountTimer);
  }, []);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: errorText === ErrorNames.None,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setHasError(ErrorNames.None)}
      />

      {errorText}
    </div>
  );
};
