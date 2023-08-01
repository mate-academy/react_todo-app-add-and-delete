import React, { useEffect } from 'react';
import classnames from 'classnames';

enum Error {
  ADD = 'add',
  EMPTY = 'empty',
  DELETE = 'delete',
  UPDATE = 'update',
  NOTHING = '',
  FETCH = 'fetch',
}

type Props = {
  hasError: string
  setHasError: (value: Error) => void
};

export const TodoNotification: React.FC<Props> = ({
  hasError,
  setHasError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setHasError(Error.NOTHING);
    }, 3000);
  }, [hasError]);

  return (
    <div
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !hasError,
        },
      )}
    >
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setHasError(Error.NOTHING);
        }}
      />

      {hasError === Error.ADD && 'Unable to add a todo'}
      {hasError === Error.DELETE && 'Unable to delete a todo'}
      {hasError === Error.UPDATE && 'Unable to update a todo'}
      {hasError === Error.FETCH
        && 'Something went wrong with fetch todos request'}
    </div>
  );
};
