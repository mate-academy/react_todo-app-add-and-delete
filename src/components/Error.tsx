import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
};

export const ErrorMessage: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-light',
        'has-text-weight-normal',
        {
          'is-danger': errorMessage !== '',
          hidden: !errorMessage,
        },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
