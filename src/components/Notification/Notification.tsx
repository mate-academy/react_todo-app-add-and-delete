/* eslint-disable */
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Error } from '../../types/todo';

type Props = {
  hasError: Error;
  setHasError: (value: Error) => void;
};

export const Notification: React.FC<Props> = ({ hasError, setHasError }) => {
  useEffect(() => {
    setTimeout(() => {
      setHasError(Error.Not);
    }, 3000);
  }, [hasError]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          'hidden': !hasError,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setHasError(Error.Not)}
      />

      {hasError === Error.Add && (
        'Unable to add a todo'
      )}

      {hasError === Error.Delete && (
        'Unable to delete a todo'
      )}

      {hasError === Error.Update && (
        'Unable to update a todo'
      )}

      {hasError === Error.Empty && (
        'Title can\'t be empty'
      )}

      {hasError === Error.Load && (
        'Some trouble with loading. Please, check you internet connection'
      )}
    </div>
  );
};
