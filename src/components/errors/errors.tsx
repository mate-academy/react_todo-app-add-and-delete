import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  onClose: (message: string) => void;
};

export const Errors: React.FC<Props> = ({ errorMessage, onClose }) => {
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
        className={classNames('delete', { hidden: !errorMessage })}
        onClick={() => onClose('')}
      />
      {errorMessage}
    </div>
  );
};
