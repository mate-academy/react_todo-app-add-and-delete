import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  shouldBeShown: boolean,
  onClose: () => void,
};

export const ErrorMessage: React.FC<Props> = React.memo(({
  errorMessage,
  shouldBeShown,
  onClose,
}) => {
  window.console.log('rendering error component');

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !shouldBeShown },
      )}
    >
      <button
        aria-label="Close"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {errorMessage}
    </div>
  );
});
