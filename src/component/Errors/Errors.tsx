import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  onClose: (message: string) => void;
};

export const Errors: React.FC<Props> = ({ errorMessage, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={`delete ${!errorMessage && 'hidden'}`}
        onClick={() => onClose('')}
      />
      {errorMessage}
    </div>
  );
};
