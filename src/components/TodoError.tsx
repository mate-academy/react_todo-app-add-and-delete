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
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
