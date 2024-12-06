import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  handleDeleteErrorMsg: () => void;
};

export const ErrorsHandler: React.FC<Props> = ({
  errorMessage,
  handleDeleteErrorMsg,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleDeleteErrorMsg}
      />
      {errorMessage}
    </div>
  );
};
