import classNames from 'classnames';
import React from 'react';

import { useAppContext } from '../../context/AppContext';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useAppContext();

  function handleHideError() {
    setError('');
  }

  setTimeout(() => {
    setError('');
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
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
