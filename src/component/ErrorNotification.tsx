/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  error: ErrorMessage,
  setError: () => void,
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
}) => {
  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={setError}
      />
      {error}
    </div>
  );
};
