import React from 'react';
import classnames from 'classnames';

type Props = {
  onErrorMessage: (value: string) => void,
  errorMessage: string,
};

export const TodoError: React.FC<Props> = ({
  onErrorMessage,
  errorMessage,
}) => {
  const resetError = () => {
    onErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classnames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        aria-label="Hide Error Button"
        type="button"
        className="delete"
        onClick={resetError}
      />

      {errorMessage}
    </div>
  );
};
