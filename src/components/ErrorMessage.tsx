/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint(jsx-a11y/label-has-associated-control) */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import classNames from 'classnames';
import { Error } from '../types/Error';

type Props = {
  error: string,
  setError: (error: Error) => void,
};

export const ErrorMessage: React.FC<Props> = ({
  error,
  setError,
}) => {
  return (
    <div
      hidden={!Error.None}
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(Error.None)}
      />
      {error}
    </div>
  );
};
