import React from 'react';
import { Errors } from '../../App';
import classNames from 'classnames';

type Props = {
  errorMessage: Errors | string;
  setErrorMessage: (errorMessage: Errors | string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage('');
        }}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
