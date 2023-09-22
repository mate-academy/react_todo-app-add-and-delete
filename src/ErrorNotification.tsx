/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorType } from './enums';

type Props = {
  error: ErrorType | null,
  onErrorHandler: (value: ErrorType | null) => void
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  onErrorHandler,
}) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        onErrorHandler(null);
      }, 3000);
    }
  }, [error]);

  return (
    <>
      {error && (
        <div
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !error },
          )}
        >
          {error}
          <button
            type="button"
            className="delete"
            onClick={() => {
              onErrorHandler(null);
            }}
          />
        </div>
      )}
    </>
  );
};
