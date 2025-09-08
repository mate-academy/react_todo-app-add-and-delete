import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  isHiddenErrorMessage: boolean;
};

export const ErrorNotifications: React.FC<Props> = ({
  errorMessage,
  isHiddenErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHiddenErrorMessage },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
