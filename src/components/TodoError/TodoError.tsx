import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  isVisible: boolean;
  onClose: () => void;
};

export const TodoError: React.FC<Props> = ({
  errorMessage,
  isVisible,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isVisible },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close error notification"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
