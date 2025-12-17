import classNames from 'classnames';
import { ErrorMessages } from '../../enums/ErrorMessages';
import './ErrorNotification.scss';
import React from 'react';

type Props = {
  errorMessage: ErrorMessages;
  onErrorMessage: (errorMessage: ErrorMessages) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger ',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage(ErrorMessages.NONE)}
      />
      {errorMessage}
    </div>
  );
};
