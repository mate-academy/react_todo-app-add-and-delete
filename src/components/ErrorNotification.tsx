import React from 'react';
import { Errors } from '../types/Types';
type ErrorNotificationProps = {
  errorMessage: Errors | null;
};

export const ErrorNotification = ({ errorMessage }: ErrorNotificationProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal hidden"
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
