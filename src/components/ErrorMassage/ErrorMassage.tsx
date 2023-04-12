import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  hasError: boolean
  onClose: () => void,
};

export const ErrorMessage = React.memo<Props>((props) => {
  const {
    errorMessage,
    hasError,
    onClose,
  } = props;

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        aria-label="close"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {errorMessage}
    </div>
  );
});
