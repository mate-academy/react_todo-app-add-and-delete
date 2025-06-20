import React from 'react';

import classNames from 'classnames';
import { errorTimeoutId } from '../../utils/fetchClient';

type Props = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const handleHideError = () => {
    window.clearTimeout(errorTimeoutId);
    setError('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      {error}
    </div>
  );
};
