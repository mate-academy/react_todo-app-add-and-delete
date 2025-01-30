import React from 'react';
import cn from 'classnames';

import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  error: keyof typeof ErrorMessages;
  setError: (error: keyof typeof ErrorMessages) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: error === 'Empty',
    })}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setError('Empty')}
    />
    {error !== 'Empty' && ErrorMessages[error]}
  </div>
);
