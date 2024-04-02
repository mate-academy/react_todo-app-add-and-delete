import React from 'react';
import { ErrorText } from '../../types/ErrorText';
import cn from 'classnames';

type Props = {
  errorText: ErrorText;
  onHideError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorText,
  onHideError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: errorText === ErrorText.NoError,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHideError}
    />
    {errorText}
  </div>
);
