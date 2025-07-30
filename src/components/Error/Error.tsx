import React from 'react';
import { ErrorMessage } from '../../constants/ErrorMessage';
import classNames from 'classnames';

interface Props {
  errorMessage: ErrorMessage;
  hideError: () => void;
}

const Error: React.FC<Props> = ({ errorMessage, hideError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === ErrorMessage.EMPTY },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
        aria-label="Close error notification"
      />
      {errorMessage}
    </div>
  );
};

export default Error;
