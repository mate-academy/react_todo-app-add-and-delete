import React from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage | '';
  hideError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  hideError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorMessage,
    })}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={hideError}
    />
    {errorMessage}
  </div>
);
