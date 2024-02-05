/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  onErrorClose: () => void;
};

export const Error: React.FC<Props> = ({
  errorMessage,
  onErrorClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onErrorClose}
      />
      {errorMessage}
    </div>
  );
};
