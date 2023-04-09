import React, { useContext } from 'react';
import classNames from 'classnames';

import { AppContext } from '../AppContext';

export const ErrorMessage: React.FC = React.memo(() => {
  const {
    shouldShowError,
    errorMessage,
    setShouldShowError,
  } = useContext(AppContext);

  const handleCloseButtonClick = () => {
    setShouldShowError(false);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !shouldShowError },
      )}
    >
      <button
        aria-label="Close"
        type="button"
        className="delete"
        onClick={handleCloseButtonClick}
      />

      {errorMessage}
    </div>
  );
});
